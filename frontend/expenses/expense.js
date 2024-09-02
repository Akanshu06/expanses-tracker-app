const form = document.querySelector('form');
const expenseList = document.getElementById('expenseList');

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const expenses = {
            amount: event.target.amount.value,
            description: event.target.description.value,
            category: event.target.category.value
        };

        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/user/addexpense', expenses, {
            headers: { Authorization: token }
        });

        if (response.status === 200) {
            alert('One expense added to your expenses');
            window.location.href = './expense.html';
        } else {
            throw new Error('Not found');
        }
    } catch (err) {
        document.body.innerHTML = `<div style='color:red'>${err}</div>`;
    }
});

// Show premium user message
function showPremiumuserMessage() {
    document.getElementById('premiumBtn').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a premium user";
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

// Fetch expenses and setup pagination on page load
window.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1; // Initialize currentPage variable
    const token = localStorage.getItem('token');
    
    // Check if user is premium
    const decodeToken = parseJwt(token);
    const isPremiumUser = decodeToken.ispremiumuser;
    if (isPremiumUser) {
        showPremiumuserMessage();
        showLeaderboard();
    }

    // Fetch initial expenses and setup pagination
    getProducts(currentPage); // Initial call to load data
});

// Fetch products with pagination
function getProducts(page) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/user/getexpense?page=${page}`, { headers: { Authorization: token } })
        .then((response) => {
            displayAllExpenses(response.data.expenses); // Update UI with new expenses
            console.log(response.data);
            showPagination(response.data); // Update pagination buttons
        })
        .catch((error) => {
            console.error('Error fetching expense data:', error);
        });
}


// Display all expenses
function displayAllExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.amount} - ${expense.description} - ${expense.category}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete expense';
        deleteBtn.type = 'button'; // Set type to button
        deleteBtn.dataset.id = expense.id; // Set dataset id to expense id

        // Add event listener to delete button
        deleteBtn.addEventListener('click', async () => {
            try {
                await deleteFunction(expense._id); // Assuming deleteFunction is defined elsewhere
                expenseList.removeChild(li); // Remove the list item from the UL
            } catch (error) {
                console.error(error);
            }
        });

        li.appendChild(deleteBtn); // Append delete button to list item
        expenseList.appendChild(li); // Append list item to UL
    });
}

// Function to delete expense
async function deleteFunction(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:3000/user/deleteexpense/${id}`, { headers: { Authorization: token } });
    } catch (error) {
        throw new Error(error);
    }
}

// Handle premium button click
const premiumBtn = document.getElementById('premiumBtn');
premiumBtn.onclick = async (event) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { Authorization: token } });
        const options = {
            "key_id": response.data.key_id, // Enter the Key ID generated from the Dashboard
            "order_id": response.data.order.id, // For one time payment

            "handler": async function (response) {
                const res = await axios.post('http://localhost:3000/purchase/purchasetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { Authorization: token } });

                alert('You are a Premium User Now');
                showPremiumuserMessage();
                localStorage.setItem('token', res.data.token);
                showLeaderboard();
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on('payment.failed', function (response) {
            alert('Payment failed. Please try again.');
        });
    } catch (error) {
        console.log(error);
    }
}

// Show leaderboard
function showLeaderboard() {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Show leaderboard';
    button.onclick = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3000/purchase/premiumFeature', { headers: { Authorization: token } });
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = `<h1>Leaderboard</h1>`;
            response.data.forEach(userDetails => {
                leaderboard.innerHTML += `<li>Name: ${userDetails.name} - Total Expense: ${userDetails.total}</li>`;
            });
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };
    document.getElementById('message').appendChild(button);
}

// Download expense data
async function download() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/user/download', { headers: { Authorization: token } });
        if (response.status === 201) {
            const a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log("Error fetching download link", error);
    }

    try {
        const URLs = await axios.get('http://localhost:3000/user/geturl', { headers: { Authorization: token } });
        if (URLs.data.url.length) {
            URLs.data.url.forEach(url => showUrl(url));
        } else {
            console.log('No URLs available');
        }
    } catch (error) {
        console.log('Error fetching URLs', error);
    }
}

// Show URLs
function showUrl(link) {
    const parent = document.getElementById('url_list');
    const child = document.createElement('li');
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "Close";
    closeBtn.onclick = () => parent.removeChild(child); // Remove URL from list
    child.textContent = `Already Downloaded - ${link.URL}`;
    child.appendChild(closeBtn);
    parent.appendChild(child);
}

// Show pagination controls
function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage }) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Previous Page Button
    const btnPrevious = document.createElement('button');
    btnPrevious.textContent = 'Previous';
    btnPrevious.classList.add('pagination-button');
    btnPrevious.setAttribute('aria-label', 'Previous page');
    btnPrevious.disabled = !hasPreviousPage;
    if (hasPreviousPage) {
        btnPrevious.addEventListener('click', () => getProducts(previousPage));
    }
    pagination.appendChild(btnPrevious);

    // Current Page Button
    const btnCurrent = document.createElement('button');
    btnCurrent.textContent = currentPage;
    btnCurrent.classList.add('pagination-button');
    btnCurrent.setAttribute('aria-label', `Current page ${currentPage}`);
    btnCurrent.disabled = true;
    pagination.appendChild(btnCurrent);

    // Next Page Button
    const btnNext = document.createElement('button');
    btnNext.textContent = 'Next';
    btnNext.classList.add('pagination-button');
    btnNext.setAttribute('aria-label', 'Next page');
    btnNext.disabled = !hasNextPage;
    if (hasNextPage) {
        btnNext.addEventListener('click', () => getProducts(nextPage));
    }
    pagination.appendChild(btnNext);
}

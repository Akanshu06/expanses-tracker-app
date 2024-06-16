const form = document.querySelector('form');
const expenseList = document.getElementById('expenseList');
// Define displayAllexpenses function outside event listener
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const expenses = {
            amount: event.target.amount.value,
            description: event.target.description.value,
            category: event.target.category.value
        };


        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:2000/expenses/addexpense', expenses, { headers: { authorization: token } });
        //console.log(response.data);
        if (response.status === 200) {
            alert('One expense added in your esxpenses');
           
            window.location.href='./expense.html'
        } else {
            throw new Error('Not found');
        }
    } catch (err) {
        document.body.innerHTML = `<div style='color:red'>${err}</div>`;
    }

});
function showPremiumuserMessage() {
    document.getElementById('premiumBtn').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token)
        //console.log(decodeToken)
        const ispremiumuser = decodeToken.ispremiumuser
        if (ispremiumuser) {
            showPremiumuserMessage()
            showLeaderboard()
        }
        const user = await axios.get(`http://localhost:2000/expenses/getExpense`, { headers: { Authorization: token } });
        for (let i = 0; i < user.data.expenses.length; i++) {
            displayAllexpenses(user.data.expenses[i]); 
        }
    } catch (error) {
        console.error(error);
    }
    function displayAllexpenses(expenses) {
        const li = document.createElement('li');
        li.innerHTML = `${expenses.amount}-${expenses.description}-${expenses.category}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete expense';
        deleteBtn.type = 'button'; // Set the type to button
        deleteBtn.dataset.id = expenses.id; // Use dataset to store id
        // Add event listener to delete button
        deleteBtn.addEventListener('click', async () => {
            try {
                await deleteFunction(expenses.id);
                expenseList.removeChild(li); // Remove the list item
            } catch (error) {
                console.error(error);
            }
        });
        li.appendChild(deleteBtn); // Append delete button to list item
        expenseList.appendChild(li); // Append list item to list
    }
});

async function deleteFunction(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:2000/expenses/deleteexpense/${id}`, { headers: { Authorization: token } });

    } catch (error) {
        throw new Error(error);
    }
}

const premiumBtn = document.getElementById('premiumBtn');
premiumBtn.onclick = async (event) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:2000/purchase/premiummembership', { headers: { Authorization: token } })
    try {
        var options = {
            "key_id": response.data.key_id, // Enter the Key ID generated from the Dashboard
            "order_id": response.data.order.id,// For one time payment

            "handler": async function (response) {
                const res = await axios.post('http://localhost:2000/purchase/purchasetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { "Authorization": token } })

                console.log(res)
                alert('You are a Premium User Now')
                showPremiumuserMessage();
                localStorage.setItem('token', res.data.token)
                showLeaderboard()
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response)
            alert('Something went wrong');
        })
    } catch (error) {
        console.log(error);
    }

}

function showLeaderboard() {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Show leaderboard';
    button.onclick = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:2000/premium/premiumFeature', { headers: { Authorization: token } });
        // console.log(response);
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = `<h1>Leard Board</h1>`
        response.data.forEach(userDetails => {
           // console.log(userDetails);
            leaderboard.innerHTML += `<li>Name-${userDetails.name} Total Expense-${userDetails.total}</li>`;
        })

    }
    document.getElementById('message').appendChild(button);
}

async function download(){
    const token=localStorage.getItem('token');
    try {
        
    const response=await axios.get('http://localhost:2000/user/download',{headers:{Authorization:token}});
    //console.log('===>',response);
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }
        
    } catch (error) {
        console.log("not geting respons",error);
    }

    const URLs=await axios.get('http://localhost:2000/user/geturl',{headers:{Authorization:token}});
    console.log(URLs);
    if(URLs){
        for (let i = 0; i < URLs.data.url.length; i++) {
            console.log(URLs.data.url);
           showUrl(URLs.data.url[i]);
        }
    }else{
        console.log('sumthing wrong');
    }
    
}

function showUrl(Links){
    const parent=document.getElementById('url_list');
   // console.log(parent)
  const child=document.createElement('li');
  const CloseBtn=document.createElement('button');
  CloseBtn.innerText="Close";
  child.textContent=`Already Downloaded -${Links.URL}`;
  parent.appendChild(child);
  parent.appendChild(CloseBtn)
  }
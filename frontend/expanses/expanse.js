const form = document.querySelector('form');
const expanseList = document.getElementById('expanseList');

// Define displayAllExpanses function outside event listener


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const expanses = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };

    try {
        const token= localStorage.getItem('token');
        const response = await axios.post('http://localhost:2000/expanses/addExpanse', expanses,{headers:{authorization:token}});
        console.log(response.data);
        if (response.status === 200) {
           document.body.innerHTML = `<div style='color:red'><h1>One expense added</h1></div>`;
           
        } else {
            throw new Error('Not found');
        }
    } catch (err) {
        document.body.innerHTML = `<div style='color:red'>${err}</div>`;
    }

    
});
// Delete expense function
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token= localStorage.getItem('token');
        const user = await axios.get(`http://localhost:2000/expanses/getExpanse`,{headers:{authorization:token}});
        for (let i = 0; i < user.data.expanses.length; i++) {
            displayAllExpanses(user.data.expanses[i]); // Call displayAllExpanses here
        }
    } catch (error) {
        console.error(error);
    }

    function displayAllExpanses(expanses) {
        const li = document.createElement('li');
        li.innerHTML = `${expanses.amount}-${expanses.description}-${expanses.category}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Expanse';
        deleteBtn.type = 'button'; // Set the type to button
        deleteBtn.dataset.id = expanses.id; // Use dataset to store id
        
        // Add event listener to delete button
        deleteBtn.addEventListener('click', async () => {
            try {
                await deleteFunction(expanses.id);
                expanseList.removeChild(li); // Remove the list item
            } catch (error) {
                console.error(error);
            }
        });

        li.appendChild(deleteBtn); // Append delete button to list item
        expanseList.appendChild(li); // Append list item to list
    }
});

// Delete expense function
async function deleteFunction(id) {
    try {
        const token= localStorage.getItem('token');
        await axios.delete(`http://localhost:2000/expanses/deleteExpanse/${id}`,{headers:{authorization:token}});
    } catch (error) {
        throw new Error(error);
    }
}


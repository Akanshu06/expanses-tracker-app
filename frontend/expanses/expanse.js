const form = document.querySelector('form');
const expanseList = document.getElementById('expanseList');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const expanses = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };

    try {
        const response = await axios.post('http://localhost:2000/expanses/addExpanse', expanses);
        console.log(response.data);
        if (response.status === 201) {
            document.body.innerHTML = `<div style='color:red'><h1>One expense added</h1></div>`;
        } else {
            throw new Error('Not found');
        }
    } catch (err) {
        document.body.innerHTML = `<div style='color:red'>${err}</div>`;
    }

});

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const response = await axios.get(`http://localhost:2000/expanses/getExpanse`);
        for (let i = 0; i < response.data.length; i++) {
            displayAllExpanses(response.data[i]);
        }
    } catch (error) {
        console.error(error);
    }
})

// Display all expenses
function displayAllExpanses(expanses) {
    const li = document.createElement('li');
    li.innerHTML = `${expanses.amount}-${expanses.description}-${expanses.category}
    <button onClick="deleteFunction(${expanses.id})">Delete Expanse</button>`;
    expanseList.appendChild(li);
}

// Delete expense function
async function deleteFunction(id) {
    try {
        await axios.delete(`http://localhost:2000/expanses/deleteExpanse/${id}`);
        const listItem = document.querySelector(`[data-id="${id}"]`);
        expanseList.removeChild(listItem);
    } catch (error) {
        console.error(error);
    }
}


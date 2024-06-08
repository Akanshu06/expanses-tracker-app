const form = document.querySelector('form');
const expanseList = document.getElementById('expanseList');
// Define displayAllExpanses function outside event listener
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
    const expanses = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };

 
        const token= localStorage.getItem('token');
        const response = await axios.post('http://localhost:2000/expenses/addexpense', expanses,{headers:{authorization:token}});
        //console.log(response.data);
        if (response.status === 200) {
            alert('One expense added in your esxpenses');
           event.target.amount.value='';
           event.target.description.value='';
           event.target.category.value='';
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
        const user = await axios.get(`http://localhost:2000/expenses/getExpense`,{headers:{Authorization:token}});
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
      const response = await axios.delete(`http://localhost:2000/expenses/deleteexpense/${id}`,{headers:{Authorization:token}});
        
    } catch (error) {
        throw new Error(error);
    }
}

//primium
const  premiumBtn = document.getElementById('premiumBtn');
premiumBtn.onclick=async(event)=>{
    const token= localStorage.getItem('token');
    const response= await axios.get('http://localhost:2000/purchase/premiummembership',{headers:{Authorization:token}})
    try {
        var options ={
     "key_id": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:2000/purchase/purchasetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  event.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong');
  })
    } catch (error) {
        console.log(error);
    }
    
}
const form = document.querySelector('form');
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const {email,password} = event.target
    const loginData={
       email:email.value,
       password:password.value
    }
axios.post(`http://localhost:2000/user/login`,loginData).then((response)=>{
      console.log(response);
            if(response.status ===200){
                window.location.href="../expanses/expanse.html"
            }else{
                throw new Error(response.data.message)
            }
}).catch((err)=>{
    console.log(JSON.stringify(err));
    document.body.innerHTML=`<div style=color:red>${err.message}</div>`
})
    
})
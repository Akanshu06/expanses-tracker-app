const form = document.querySelector('form');
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const {email,password} = event.target
    const loginData={
       email:email.value,
       password:password.value
    }
axios.post(`http://localhost:2000/user/login`,loginData).then((response)=>{
      console.log(response.data);
      localStorage.setItem('token',response.data.token)
        window.location.href='../expanses/expanse.html'   
}).catch((err)=>{
    console.log(JSON.stringify(err))
    document.body.innerHTML=`<div style=color:red>${err.message}</div>`
})
    
})
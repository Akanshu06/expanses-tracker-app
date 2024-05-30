const signUpForm = document.querySelector('form');
signUpForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const signupDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    axios.post('http://localhost:2000/user/signup',signupDetails)
    .then((response)=>{
        console.log(response.email);
        if(response.status===201){
            document.body.innerHTML=`<div style='color:red'> <a href="../login/login .html"> click here to login</a></div>`
        }else{
            throw new Error('not found')
        }
    }).catch((err)=>{
        document.body.innerHTML=`<div style='color:red'>${err}</div>`
    })
})
const signUpForm = document.querySelector('form');
signUpForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const signupDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    axios.post('http://localhost:3000/user/signup',signupDetails)
    .then((response)=>{
        if(response.status===201){
            window.location.href = '../login/login.html'
        }else{
            throw new Error('not found')
        }
    }).catch((err)=>{
        document.body.innerHTML=`<div style='color:red'>${err}</div>`
    })
})
const signUpForm = document.querySelector('form');
signUpForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const signupDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    axios.post('http://3.109.184.246:2000/user/signup',signupDetails)
    .then((response)=>{
        if(response.status===201){
            document.body.innerHTML=` <a href="../login/login.html"> click here to login</a>`
        }else{
            throw new Error('not found')
        }
    }).catch((err)=>{
        document.body.innerHTML=`<div style='color:red'>${err}</div>`
    })
})
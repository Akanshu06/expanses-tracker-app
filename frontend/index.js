const singUpForm = document.querySelector('form');
singUpForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    console.log(event.target.name.value);
    const singupDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.value
    }
    axios.post('http://localhost:2000/user/singup',singupDetails)
    .then((response)=>{
        if(response.status===200){
            window.location.href='../frontend/login.html';
        }else{
            throw new Error('not found')
        }
    }).catch((err)=>{
        document.body.innerHTML=`<div style='color:red'>${err}</div>`
    })
})
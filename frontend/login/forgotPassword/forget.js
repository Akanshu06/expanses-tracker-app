const form=document.querySelector('form');
     
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const token = localStorage.getItem("token")
    const mail =e.target.email.value;
    const user={
        mail:mail
    }
    axios.post('http://52.66.109.123:2000//password/forget-password',user,{
        headers:{Authorisation:token}
    }).then((response)=>{
        console.log(response);
        document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
    })
})
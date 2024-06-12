const form=document.querySelector('form');
     
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const token = localStorage.getItem("token")
    const mail =document.getElementById("email").value;
    const user={
        mail:mail
    }
    axios.post('http://localhost:2000/password/forget-password',user,{
        headers:{Authorisation:token}
    }).then((response)=>{
        console.log(response);
        alert("Email sent successfully")
    })
})
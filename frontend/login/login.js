const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { email, password } = event.target;
  const loginData = {
    email: email.value,
    password: password.value,
  };

  axios
    .post(`https://expanses-tracker-app-r.onrender.com/user/login`, loginData)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      // console.log(response.data);
      window.location.href = "../expenses/expense.html";
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      document.body.innerHTML = `<div style=color:red>${err.message}</div>`;
    });
});

//forget button
const forgetBtn = document.getElementById("Forget-password");
forgetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./forgotPassword/forget.html";
});

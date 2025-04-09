const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const mail = e.target.email.value;
  const user = {
    mail: mail,
  };
  axios
    .post(
      "https://expanses-tracker-app-r.onrender.com/password/forget-password",
      user,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      console.log(response);
      document.body.innerHTML +=
        '<div style="color:red;">Mail Successfuly sent <div>';
    });
});

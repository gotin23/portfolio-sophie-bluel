const errorMessage = document.getElementById("error-msg-login");

document.getElementById("btn-login").addEventListener("click", async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(email, password);
  e.preventDefault();

  const response = await fetch("http://" + window.location.hostname + ":5678/api/users/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
  });

  const body = await response.json();

  if (body.token === undefined) {
    errorMessage.textContent = "le mot de passe ou l'adresse email est incorrect";
  } else {
    setCookie("token", body.token, 3600);
    window.location.href = "http://" + window.location.hostname + ":5500/index.html";
  }
});

function setCookie(key, content, expiration) {
  document.cookie = `${key}=${content} path=/; max-age=${expiration}`;
}

const form = document.getElementById("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    if (usuario === "throsfox@gmail.com" && senha == "1234"){
        window.location.href = "inicio.html";
    }
    else {
        alert("Usuario ou senha incorretos.")
    }
});
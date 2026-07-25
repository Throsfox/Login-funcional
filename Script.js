const entrar = document.getElementById("entrar");
const cadastrar = document.getElementById("cadastrar")
const cadastro = document.getElementById("cadastro")


entrar.addEventListener("click", function(event) {
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

cadastrar.addEventListener("click", () => {
    window.location.href = "cadastrar.html";
});
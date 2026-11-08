/*Elementos das páginas de cadastro e login*/
const entrar = document.getElementById("entrar");
const cadastrar = document.getElementById("cadastrar");
const formulario = document.getElementById("form");
const opcoes = document.getElementById("opcoes");

/*Login*/

if (entrar) {
    entrar.addEventListener("click", function(event) {
        event.preventDefault();

        const usuario = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        if (usuario === "throsfox@gmail.com" && senha === "1234") {
            window.location.href = "inicio.html";
        } else {
            alert("Usuário ou senha incorretos.");
        }
    });
}

/*Cadastro*/

if (formulario && opcoes) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        const tipoCadastro = opcoes.value;

        if (tipoCadastro === "vendedor") {
            window.location.href = "vendedor.html";

        } else if (tipoCadastro === "cliente") {
            window.location.href = "cliente.html";

        } else {
            alert("Selecione um tipo de cadastro.");
        }
    });
}

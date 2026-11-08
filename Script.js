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
if(cadastrar){
    cadastrar.addEventListener("click", function(event) {
        window.location.href = "cadastrar.html";
    })
}

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

const tipoCadastro = document.getElementById("opcoes");
const dadosAdicionais = document.getElementById("dadosAdicionais");
const campoCPF = document.getElementById("campoCPF");
const campoCNPJ = document.getElementById("campoCNPJ");
const cpf = document.getElementById("cpf");
const cnpj = document.getElementById("cnpj");

tipoCadastro.addEventListener("change", function() {

    dadosAdicionais.hidden = false;

    campoCPF.hidden = true;
    campoCNPJ.hidden = true;

    cpf.required = false;
    cnpj.required = false;

    if (tipoCadastro.value === "cliente") {

        campoCPF.hidden = false;
        cpf.required = true;

    }

    else if (tipoCadastro.value === "vendedor") {

        campoCNPJ.hidden = false;
        cnpj.required = true;

    }

});


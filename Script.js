/*Elementos das páginas de cadastro e login*/
const entrar = document.getElementById("entrar");
const cadastrar = document.getElementById("cadastrar");
const formularioCadastro = document.getElementById("cadastroForm");
const opcoes = document.getElementById("opcoes");

/*Login*/

if (entrar) {
    entrar.addEventListener("click", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const usuario = fazerLogin(email, senha);

        if (usuario) {
            window.location.href = PAGINA_INICIAL[usuario.tipo];
        } else {
            alert("E-mail ou senha incorretos.");
        }
    });
}

/*Cadastro*/
if(cadastrar){
    cadastrar.addEventListener("click", function(event) {
        window.location.href = "cadastrar.html";
    })
}

if (formularioCadastro && opcoes) {
    formularioCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        /*
            O cadastro ainda não está conectado ao banco de dados.
            Por enquanto, volta para o login para entrar com uma conta de teste.
        */
        alert("Cadastro preenchido, mas ainda não está conectado ao banco de dados. Entre com uma conta de teste.");
        window.location.href = "index.html";
    });

    /*Campos que mudam de acordo com o tipo de cadastro*/
    const dadosAdicionais = document.getElementById("dadosAdicionais");
    const campoCPF = document.getElementById("campoCPF");
    const campoCNPJ = document.getElementById("campoCNPJ");
    const cpf = document.getElementById("cpf");
    const cnpj = document.getElementById("cnpj");
    const nomeLoja = document.getElementById("NomeLoja");

    opcoes.addEventListener("change", function() {

        dadosAdicionais.hidden = false;

        campoCPF.hidden = true;
        campoCNPJ.hidden = true;

        cpf.required = false;
        cnpj.required = false;
        nomeLoja.required = false;

        if (opcoes.value === "cliente") {

            campoCPF.hidden = false;
            cpf.required = true;

        }

        else if (opcoes.value === "vendedor") {

            campoCNPJ.hidden = false;
            cnpj.required = true;
            nomeLoja.required = true;

        }

    });
}

/* ========== LOGIN (index.html) ========== */

const formLogin = document.getElementById("form");
const botaoCadastrar = document.getElementById("cadastrar");

if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const usuario = lerUsuarios().find(
            u => u.email === email && u.senha === senha
        );

        if (!usuario) {
            alert("E-mail ou senha incorretos.");
            return;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        irParaPainel(usuario.tipo);
    });
}

if (botaoCadastrar) {
    botaoCadastrar.addEventListener("click", function () {
        window.location.href = "cadastrar.html";
    });
}

/* ========== CADASTRO (cadastrar.html) ========== */

const formCadastro = document.getElementById("cadastroForm");

if (formCadastro) {
    const selectTipo = document.getElementById("opcoes");
    const dadosAdicionais = document.getElementById("dadosAdicionais");
    const campoCPF = document.getElementById("campoCPF");
    const campoCNPJ = document.getElementById("campoCNPJ");
    const cpf = document.getElementById("cpf");
    const cnpj = document.getElementById("cnpj");
    const nomeEmpresa = document.getElementById("NomeEmpresa");

    // Mostra CPF (cliente) ou CNPJ + empresa (vendedor)
    selectTipo.addEventListener("change", function () {
        const ehCliente = selectTipo.value === "cliente";
        const ehVendedor = selectTipo.value === "vendedor";

        dadosAdicionais.hidden = false;
        campoCPF.hidden = !ehCliente;
        campoCNPJ.hidden = !ehVendedor;

        cpf.required = ehCliente;
        cnpj.required = ehVendedor;
        nomeEmpresa.required = ehVendedor;
    });
}
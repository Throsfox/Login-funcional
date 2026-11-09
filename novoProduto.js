
// SELEÇÃO DOS ELEMENTOS
const tipoProduto = document.getElementById("tipoProduto");
const avisoTipo = document.getElementById("avisoTipo");
const formNovoProduto = document.getElementById("formNovoProduto");


// GRUPOS DE CAMPOS DE CADA TIPO DE PRODUTO
const gruposEspecificos = {
    "ar-condicionado": document.getElementById("camposArCondicionado"),
    "climatizador": document.getElementById("camposClimatizador"),
    "acessorio": document.getElementById("camposAcessorio"),
    "peca": document.getElementById("camposPeca")
};


// EXIBIR OS CAMPOS DE ACORDO COM O TIPO SELECIONADO
function atualizarCamposProduto() {
    const tipoSelecionado = tipoProduto.value;

    // OCULTA TODOS OS GRUPOS
    Object.values(gruposEspecificos).forEach(grupo => {
        grupo.hidden = true;
    });

    // EXIBE SOMENTE O GRUPO CORRESPONDENTE
    if (gruposEspecificos[tipoSelecionado]) {
        gruposEspecificos[tipoSelecionado].hidden = false;
        avisoTipo.hidden = true;
    } else {
        avisoTipo.hidden = false;
    }
}


// EVENTO DE ALTERAÇÃO DO TIPO DE PRODUTO
tipoProduto.addEventListener("change", atualizarCamposProduto);


// ATUALIZAR A EXIBIÇÃO DEPOIS DE LIMPAR O FORMULÁRIO
formNovoProduto.addEventListener("reset", () => {
    setTimeout(atualizarCamposProduto, 0);
});


// SUBMISSÃO TEMPORÁRIA
formNovoProduto.addEventListener("submit", (event) => {
    event.preventDefault();

    /*
        O formulário ainda não está conectado ao backend.
        Posteriormente, os dados serão enviados ao servidor
        e armazenados no banco de dados.
    */

    alert("O formulário está preenchido, mas o cadastro ainda não está conectado ao banco de dados.");
});

const formNovoProduto = document.getElementById("formNovoProduto");
const tipoProduto = document.getElementById("tipoProduto");
const nomeProduto = document.getElementById("nomeProduto");
const marcaProduto = document.getElementById("marcaProduto");
const precoFabrica = document.getElementById("precoFabrica");
const descricaoProduto = document.getElementById("descricaoProduto");
const imagemProduto = document.getElementById("imagemProduto");
const situacaoProduto = document.getElementById("situacaoProduto");

if (formNovoProduto) {

    //VALIDAR OS DADOS DO FORMULÁRIO

    function validarProduto() {

        const nome = nomeProduto.value.trim();
        const marca = marcaProduto.value.trim();
        const descricao = descricaoProduto.value.trim();
        const preco = Number(precoFabrica.value);

        if (!tipoProduto.value) {
            alert("Selecione o tipo do produto.");
            tipoProduto.focus();
            return false;
        }

        if (!nome) {
            alert("Informe o nome do produto.");
            nomeProduto.focus();
            return false;
        }

        if (!marca) {
            alert("Informe a marca do produto.");
            marcaProduto.focus();
            return false;
        }

        if (!Number.isFinite(preco) || preco <= 0) {
            alert("Informe um preço válido para o produto.");
            precoFabrica.focus();
            return false;
        }

        if (!descricao) {
            alert("Informe a descrição do produto.");
            descricaoProduto.focus();
            return false;
        }

        if (!situacaoProduto.value) {
            alert("Selecione a situação do produto.");
            situacaoProduto.focus();
            return false;
        }

        // Verificar se o arquivo selecionado é uma imagem válida

        const arquivo = imagemProduto.files[0];

        if (arquivo) {

            const formatosPermitidos = [
                "image/jpeg",
                "image/png"
            ];

            if (!formatosPermitidos.includes(arquivo.type)) {
                alert("Selecione uma imagem JPG ou PNG.");
                imagemProduto.focus();
                return false;
            }

            const tamanhoMaximo = 5 * 1024 * 1024;

            if (arquivo.size > tamanhoMaximo) {
                alert("A imagem não pode ultrapassar 5 MB.");
                imagemProduto.focus();
                return false;
            }
        }

        return true;
    }

    //EVENTO DE ENVIO DO FORMULÁRIO

    formNovoProduto.addEventListener("submit", function (event) {

        // Impede o envio tradicional do formulário
        event.preventDefault();

        // Executa as validações
        if (!validarProduto()) {
            return;
        }

        // Captura os dados do formulário
        const dadosProduto = new FormData(formNovoProduto);

        // Exibe os dados no console para testes
        console.log("Dados do produto:");

        for (const [campo, valor] of dadosProduto.entries()) {

            if (valor instanceof File) {
                console.log(campo, valor.name);
            } else {
                console.log(campo, valor);
            }

        }

        // Cadastro ainda não conectado ao Flask

        alert(
            "Validação concluída!\n\n" +
            "Os dados do produto foram capturados corretamente.\n" +
            "A integração com o banco de dados será implementada posteriormente."
        );

    });

    //EVENTO DE LIMPAR O FORMULÁRIO

    formNovoProduto.addEventListener("reset", function () {

        console.log("Formulário de produto limpo.");

    });

}
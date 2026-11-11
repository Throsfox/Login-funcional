/* ANUNCIAR PRODUTO: o vendedor escolhe um item do catálogo e define preço e estoque */
(function () {
    if (!PERMITIDO) return;

    const por = id => document.getElementById(id);
    const produto = CATALOGO.find(c => c.id === Number(parametro("id")) && c.situacao === "ativo");

    if (!produto) {
        window.location.replace("empresa.html");
        return;
    }

    // Se a loja já anuncia este produto, vai direto para a edição do anúncio
    const existente = ofertasDaLoja(USUARIO.lojaId).find(o => o.catalogoId === produto.id);
    if (existente) {
        window.location.replace("produto.html?id=" + existente.id + "#GerenciarAnuncio");
        return;
    }

    por("nomeProduto").value = produto.nome;
    por("modeloProduto").value = produto.modelo;
    por("tipoProduto").value = TIPOS[produto.tipo];
    por("precoFabrica").value = reais(produto.precoFabrica);

    por("formAnuncio").addEventListener("submit", function (evento) {
        evento.preventDefault();

        const venda = Number(por("precoVenda").value);
        const promocional = Number(por("precoPromocional").value);

        if (promocional && promocional >= venda) {
            alert("O preço promocional deve ser menor que o preço de venda.");
            return;
        }

        /* O anúncio será gravado no banco de dados quando o servidor estiver pronto. */
        alert("O formulário está preenchido, mas o anúncio ainda não está conectado ao banco de dados.");
    });
})();

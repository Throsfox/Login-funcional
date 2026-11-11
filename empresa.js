/* CATÁLOGO DA CENTRAL: administrador gerencia, vendedor escolhe o que anunciar */
(function () {
    if (!PERMITIDO) return;

    const ehAdmin = USUARIO.tipo === "administrador";

    // O vendedor só vê os produtos ativos
    const itens = ehAdmin ? CATALOGO : CATALOGO.filter(c => c.situacao === "ativo");

    function acoes(produto) {
        if (ehAdmin) {
            return '<a class="acaoEditar" href="novoProduto.html?id=' + produto.id + '">Editar</a>' +
                (produto.situacao === "ativo" ? '<a class="acaoDescontinuar" href="#" data-pendente>Descontinuar</a>' : '');
        }

        const anuncio = ofertasDaLoja(USUARIO.lojaId).find(o => o.catalogoId === produto.id);

        return anuncio
            ? '<a class="acaoEditar" href="produto.html?id=' + anuncio.id + '#GerenciarAnuncio">Editar anúncio</a>'
            : '<a class="acaoEditar" href="anunciarProduto.html?id=' + produto.id + '">Anunciar na minha loja</a>';
    }

    document.querySelector("#TabelaProdutos tbody").innerHTML = itens.map(function (c) {
        const ativo = c.situacao === "ativo";

        return '<tr>' +
            '<td><div class="produtoTabela"><div class="miniaturaProduto">' + SIGLAS[c.tipo] + '</div>' +
                '<div><strong>' + c.nome + '</strong><span>Modelo ' + c.modelo + '</span></div></div></td>' +
            '<td>' + TIPOS[c.tipo] + '</td>' +
            '<td>' + reais(c.precoFabrica) + '</td>' +
            '<td><span class="' + (ativo ? 'tagAtivo">Ativo' : 'tagInativo">Descontinuado') + '</span></td>' +
            '<td><div class="acoesTabela">' + acoes(c) + '</div></td>' +
        '</tr>';
    }).join("");

    document.getElementById("resumoCatalogo").textContent = itens.length + " produto(s) no catálogo";

    if (ehAdmin) {
        const ativos = CATALOGO.filter(c => c.situacao === "ativo").length;
        document.getElementById("totalProdutos").textContent = CATALOGO.length;
        document.getElementById("produtosAtivos").textContent = ativos;
        document.getElementById("produtosDescontinuados").textContent = CATALOGO.length - ativos;
    }
})();

/* PAINEL DO VENDEDOR: preenche o painel com os dados da loja de quem entrou */
(function () {
    if (!PERMITIDO) return;

    const loja = buscarLoja(USUARIO.lojaId);
    const ofertas = ofertasDaLoja(loja.id);
    const promocoes = ofertas.filter(o => o.precoAntigo);

    // Dashboard
    const indicadores = document.querySelectorAll(".cardIndicador h2");
    indicadores[0].textContent = ofertas.length;
    indicadores[1].textContent = promocoes.length;
    indicadores[2].textContent = loja.regiao;

    // Meus produtos
    document.querySelector("#TabelaProdutos tbody").innerHTML = ofertas.map(function (o) {
        const ativo = o.situacao === "ativo";

        return '<tr>' +
            '<td><div class="produtoTabela"><div class="miniaturaProduto">' + SIGLAS[o.tipo] + '</div>' +
                '<div><strong>' + o.nome + '</strong><span>' + o.modelo + '</span></div></div></td>' +
            '<td>' + o.marca + '</td>' +
            '<td>' + reais(o.preco) + '</td>' +
            '<td>' + (o.precoAntigo ? '<span class="tagPromocao">-' + desconto(o) + '%</span>' : '<span class="semPromocao">Sem promoção</span>') + '</td>' +
            '<td><span class="' + (ativo ? 'tagAtivo">Ativo' : 'tagInativo">Inativo') + '</span></td>' +
            '<td><a class="acaoEditar" href="produto.html?id=' + o.id + '#GerenciarAnuncio">Editar</a></td>' +
        '</tr>';
    }).join("");

    const marcas = [...new Set(ofertas.map(o => o.marca))];
    document.querySelector(".campoFiltro").innerHTML += marcas.map(m => "<option>" + m + "</option>").join("");
    document.querySelector(".rodapeTabela p").textContent = ofertas.length + " produto(s) anunciado(s)";

    // Promoções
    document.querySelector(".gradePromocoes").innerHTML = promocoes.map(o =>
        '<div class="cardPromocao">' +
            '<div class="promocaoTopo"><span>' + o.marca + '</span><span class="tagPromocao">-' + desconto(o) + '%</span></div>' +
            '<h3>' + o.nome + '</h3>' +
            '<div class="precoOriginal">' + reais(o.precoAntigo) + '</div>' +
            '<h2>' + reais(o.preco) + '</h2>' +
            '<p class="validadePromocao">Válida até ' + o.validade + '</p>' +
            '<a class="btnEditarPromocao" href="produto.html?id=' + o.id + '#GerenciarAnuncio">Editar promoção</a>' +
        '</div>'
    ).join("");

    // Minha loja
    document.querySelector(".cabecalhoLoja h3").textContent = loja.nome;

    const dados = [USUARIO.nome, USUARIO.email, loja.telefone, loja.estado, loja.cidade, loja.regiao, loja.endereco];
    document.querySelectorAll(".gradeInformacoes strong").forEach((campo, i) => campo.textContent = dados[i]);
})();

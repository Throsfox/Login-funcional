/* PÁGINA DA LOJA: mostra os produtos da loja e libera a edição para o dono */
(function () {
    if (!PERMITIDO) return;

    const loja = buscarLoja(parametro("id"));
    if (!loja) {
        window.location.replace("cliente.html");
        return;
    }

    const por = id => document.getElementById(id);
    const ehDono = USUARIO.tipo === "vendedor" && USUARIO.loja_id === loja.id;
    const podeComprar = USUARIO.tipo === "cliente" || (USUARIO.tipo === "vendedor" && !ehDono);

    document.title = "Central de ar LTDA | " + loja.nome;
    por("nomeLoja").textContent = loja.nome;
    por("localLoja").textContent = loja.cidade + "/" + loja.estado + " · Região " + loja.regiao;
    por("telefoneLoja").textContent = loja.telefone;
    por("emailLoja").textContent = loja.email;
    document.querySelector(".linkGerenciarLoja").style.display = ehDono ? "" : "none";

    // O dono vê também os anúncios inativos
    const ofertas = ofertasDaLoja(loja.id).filter(o => ehDono || o.situacao === "ativo");

    document.querySelector(".grade-produtos").innerHTML = ofertas.map(function (o) {
        const percentual = desconto(o);

        return '<div class="produtoCard">' +
            (percentual ? '<div class="tagDesconto">-' + percentual + '%</div>' : '') +
            '<div class="produtoImg"></div>' +
            '<div class="produtoInfo">' +
                '<span class="marca">' + o.marca + '</span>' +
                '<h4>' + o.nome + '</h4>' +
                (o.precoAntigo ? '<div class="precoAntigo">' + reais(o.precoAntigo) + '</div>' : '') +
                '<div class="precoAtual">' + reais(o.preco) + '</div>' +
                '<p class="parcelamento">em até 10x sem juros</p>' +
                '<a href="produto.html?id=' + o.id + '" class="btn-comprar">' +
                    (podeComprar ? 'Comprar' : (ehDono ? 'Ver / editar anúncio' : 'Ver produto')) +
                '</a>' +
            '</div>' +
        '</div>';
    }).join("");

    por("semProdutos").hidden = ofertas.length > 0;
})();

/* PÁGINA DO PRODUTO: mostra o produto e libera compra ou edição conforme quem entrou */
(function () {
    if (!PERMITIDO) return;

    const oferta = buscarOferta(parametro("id"));
    if (!oferta) {
        window.location.replace("cliente.html");
        return;
    }

    const por = id => document.getElementById(id);

    // Quem é quem nesta página
    const ehDono = USUARIO.tipo === "vendedor" && USUARIO.loja_id === oferta.loja_id;
    const podeComprar = USUARIO.tipo === "cliente" || (USUARIO.tipo === "vendedor" && !ehDono);

    // Dados do produto
    document.title = "Central de ar LTDA | " + oferta.nome;
    por("tipoProduto").textContent = TIPOS[oferta.tipo];
    por("nomeProduto").textContent = oferta.nome;
    por("modeloProduto").textContent = oferta.modelo;
    por("precoAntigo").textContent = oferta.precoAntigo ? reais(oferta.precoAntigo) : "";
    por("precoAtual").textContent = reais(oferta.preco);
    por("parcelamento").textContent = "em até 10x sem juros";
    por("linkLoja").textContent = oferta.loja.nome;
    por("linkLoja").href = "loja.html?id=" + oferta.loja.id;
    por("descricaoProduto").textContent = oferta.descricao;
    por("listaCaracteristicas").innerHTML = oferta.caracteristicas
        .map(c => "<div><dt>" + c[0] + "</dt><dd>" + c[1] + "</dd></div>").join("");

    // Compra
    const formCompra = por("formCompra");
    const quantidade = por("quantidade");

    function atualizarTotal() {
        por("totalPedido").textContent = reais(oferta.preco * (Number(quantidade.value) || 1));
    }

    quantidade.max = oferta.estoque;
    quantidade.addEventListener("input", atualizarTotal);
    por("enderecoEntrega").textContent = USUARIO.endereco || "";
    atualizarTotal();

    if (!podeComprar) {
        formCompra.style.display = "none";
        por("avisoCompra").textContent = ehDono
            ? "Este produto é da sua loja. Você pode editar o anúncio mais abaixo."
            : "Administradores podem apenas visualizar os produtos.";
        por("avisoCompra").hidden = false;
    }

    formCompra.addEventListener("submit", function (evento) {
        evento.preventDefault();

        /*
            O pagamento e a criação do pedido ainda não estão implementados.
            Por enquanto, só mostra a confirmação.
        */
        formCompra.style.display = "none";
        por("ConfirmacaoCompra").hidden = false;
    });

    // Gerenciar anúncio (somente o vendedor dono do produto)
    por("GerenciarAnuncio").style.display = ehDono ? "" : "none";

    if (ehDono) {
        por("precoVenda").value = oferta.precoAntigo || oferta.preco;
        por("precoPromocional").value = oferta.precoAntigo ? oferta.preco : "";
        por("estoque").value = oferta.estoque;
        por("situacaoAnuncio").value = oferta.situacao;

        por("formAnuncio").addEventListener("submit", function (evento) {
            evento.preventDefault();

            const venda = Number(por("precoVenda").value);
            const promocional = Number(por("precoPromocional").value);

            if (promocional && promocional >= venda) {
                alert("O preço promocional deve ser menor que o preço de venda.");
                return;
            }

            alert("Alterações validadas, mas ainda não estão conectadas ao banco de dados.");
        });
    }
})();

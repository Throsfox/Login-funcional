/* VITRINE: completa o "Vendido por" de cada card com a loja do produto */
(function () {
    if (!PERMITIDO) return;

    document.querySelectorAll(".produtoCard").forEach(function (card) {
        const botao = card.querySelector(".btn-comprar");
        const link = card.querySelector(".vendidoPor a");
        const oferta = buscarOferta(new URL(botao.href).searchParams.get("id"));

        if (oferta) {
            link.textContent = oferta.loja.nome;
            link.href = "loja.html?id=" + oferta.loja.id;
        }
    });
})();

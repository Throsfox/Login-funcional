/* PÁGINA DE MEUS PEDIDOS DO CLIENTE: carrega os pedidos do usuário logado e permite filtrar a situação
   (Pendente -> Enviado -> Entregue / Cancelado)
   Dados mockados temporários; ao conectar o banco, as funções de consulta substituem o array abaixo.
*/
(function () {
    if (!PERMITIDO) return;

    /* -------------------------------------- DADOS -------------------------------------- */
    const MEUS_PEDIDOS = [
        { id: 1, data: "10/11/2026", produto: "Ar-Condicionado Split Inverter 9.000 BTUs Frio", loja: "Frio Total Climatização", quantidade: 1, total: "R$ 2.124,15", situacao: "pendente" },
        { id: 2, data: "10/11/2026", produto: "Ar-Condicionado WindFree 12.000 BTUs Quente/Frio", loja: "Clima Norte", quantidade: 2, total: "R$ 5.938,20", situacao: "enviado" },
        { id: 3, data: "09/11/2026", produto: "Ar-Condicionado Split Inverter 18.000 BTUs Frio", loja: "Frio Total Climatização", quantidade: 1, total: "R$ 4.199,00", situacao: "entregue" },
        { id: 4, data: "08/11/2026", produto: "Climatizador Evaporativo 40 L", loja: "Clima Norte", quantidade: 1, total: "R$ 650,00", situacao: "cancelado" }
    ];

    /* -------------------------------------- DOM ----------------------------------------- */
    const filtroSituacao = document.getElementById("filtroSituacao");
    const tbody = document.querySelector("#TabelaPedidos tbody");
    const resumo = document.getElementById("resumoPedidos");

    /* ------------------------------ Renderização da tabela ----------------------------- */
    function renderPedidos(pedidos) {
        if (pedidos.length === 0) {
            tbody.innerHTML = "";
            document.getElementById("semPedidos").hidden = false;
            resumo.textContent = "Você ainda não fez nenhum pedido.";
            return;
        }

        document.getElementById("semPedidos").hidden = true;

        tbody.innerHTML = pedidos.map(function (p) {
            const tagClass = "tag" + p.situacao.charAt(0).toUpperCase() + p.situacao.slice(1);
            return '<tr>' +
                '<td>PED' + String(p.id).padStart(4, "0") + '</td>' +
                '<td>' + p.data + '</td>' +
                '<td>' + p.produto + '</td>' +
                '<td>' + p.loja + '</td>' +
                '<td>' + p.quantidade + '</td>' +
                '<td>' + p.total + '</td>' +
                '<td><span class="' + tagClass + '">' + p.situacao + '</span></td>' +
                '<td>' + (p.situacao === "entregue" ? '<a href="produto.html" class="acaoVerProduto">Ver produto</a>' : "") + '</td>' +
            '</tr>';
        }).join("");
        resumo.textContent = pedidos.length + " pedido(s) encontrado(s)";
    }

    /* ---------------------------------- Filtros ------------------------------------- */
    function aplicarFiltro() {
        var valor = filtroSituacao.value;
        var filtrados = MEUS_PEDIDOS.filter(function (p) {
            if (valor && p.situacao !== valor) return false;
            return true;
        });
        renderPedidos(filtrados);
    }

    filtroSituacao.addEventListener("change", aplicarFiltro);

    /* Carregar todos os pedidos ao iniciar */
    renderPedidos(MEUS_PEDIDOS);
})();

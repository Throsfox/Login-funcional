/* PÁGINA DE PEDIDOS DO VENDEDOR: carrega os pedidos recebidos e permite filtrar a situação de cada um
   (Pendente -> Enviado -> Entregue / Cancelado)
   Dados mockados temporários; ao conectar o banco, as funções de consulta substituem o array abaixo.
*/
(function () {
    if (!PERMITIDO) return;

    /* -------------------------------------- DADOS -------------------------------------- */
    /*
        Situação dos pedidos (propósito da simulação):
        - pendente: o cliente finalizou a compra, aguarda a loja confirmar
        - enviado:  o vendedor confirmou e o pedido está a caminho do cliente
        - entregue: o cliente recebeu o produto
        - cancelado: o pedido foi cancelado (pela loja ou pelo cliente)
    */
    const PEDIDOS = [
        { id: 1, data: "10/11/2026", produto: "Ar-Condicionado Split Inverter 9.000 BTUs Frio", loja: "Frio Total Climatização", cliente: "Cliente Teste", quantidade: 1, total: "R$ 2.124,15", situacao: "pendente" },
        { id: 2, data: "10/11/2026", produto: "Ar-Condicionado WindFree 12.000 BTUs Quente/Frio", loja: "Clima Norte", cliente: "Cliente Teste", quantidade: 2, total: "R$ 5.938,20", situacao: "enviado" },
        { id: 3, data: "09/11/2026", produto: "Ar-Condicionado Split Inverter 18.000 BTUs Frio", loja: "Frio Total Climatização", cliente: "Cliente Teste", quantidade: 1, total: "R$ 4.199,00", situacao: "entregue" },
        { id: 4, data: "08/11/2026", produto: "Climatizador Evaporativo 40 L", loja: "Clima Norte", cliente: "Cliente Teste", quantidade: 1, total: "R$ 650,00", situacao: "cancelado" }
    ];

    /* -------------------------------------- DOM ----------------------------------------- */
    const filtroSituacao = document.getElementById("filtroSituacao");
    const pesquisaPedido = document.getElementById("pesquisaPedido");
    const tbody = document.querySelector("#TabelaPedidos tbody");
    const resumo = document.getElementById("resumoPedidos");

    /* ------------------------------ Renderização da tabela ----------------------------- */
    function renderPedidos(pedidos) {
        if (pedidos.length === 0) {
            tbody.innerHTML = "";
            document.getElementById("semPedidos").hidden = false;
            resumo.textContent = "Nenhum pedido encontrado.";
            return;
        }

        document.getElementById("semPedidos").hidden = true;

        tbody.innerHTML = pedidos.map(function (p) {
            const tagClass = "tag" + p.situacao.charAt(0).toUpperCase() + p.situacao.slice(1);
            return '<tr>' +
                '<td>PED' + String(p.id).padStart(4, "0") + '</td>' +
                '<td>' + p.data + '</td>' +
                '<td>' + p.produto + '</td>' +
                '<td>' + p.cliente + '</td>' +
                '<td>' + p.quantidade + '</td>' +
                '<td>' + p.total + '</td>' +
                '<td><span class="' + tagClass + '">' + p.situacao + '</span></td>' +
                '<td>' +
                '<select class="selectSituacao" data-pedido-id="' + p.id + '">' +
                '<option value="pendente"' + (p.situacao === "pendente" ? " selected" : "") + '>Pendente</option>' +
                '<option value="enviado"' + (p.situacao === "enviado" ? " selected" : "") + '>Enviado</option>' +
                '<option value="entregue"' + (p.situacao === "entregue" ? " selected" : "") + '>Entregue</option>' +
                '<option value="cancelado"' + (p.situacao === "cancelado" ? " selected" : "") + '>Cancelado</option>' +
                '</select>' +
                '</td>' +
            '</tr>';
        }).join("");
        resumo.textContent = pedidos.length + " pedido(s) encontrado(s)";
    }

    /* ---------------------------------- Filtros ------------------------------------- */
    function aplicarFiltro() {
        var valor = filtroSituacao.value;
        var termo = pesquisaPedido.value.toLowerCase();
        var filtrados = PEDIDOS.filter(function (p) {
            if (valor && p.situacao !== valor) return false;
            if (termo && !(p.produto + p.cliente + p.loja + p.situacao).toLowerCase().includes(termo)) return false;
            return true;
        });
        renderPedidos(filtrados);
    }

    filtroSituacao.addEventListener("change", aplicarFiltro);
    pesquisaPedido.addEventListener("input", aplicarFiltro);

    /* Carregar todos os pedidos ao iniciar */
    renderPedidos(PEDIDOS);

    /* ------------------------------ Atualização de situação ------------------------------ */
    document.addEventListener("change", function (evento) {
        if (!evento.target.classList.contains("selectSituacao")) return;
        if (!PERMITIDO) return;

        var id = Number(evento.target.dataset.pedidoId);
        var sitAtual = evento.target.value;
        var pedido = PEDIDOS.find(function (p) { return p.id === id; });
        if (!pedido) return;

        /* Atualiza o estado local (simula o envio para o servidor) */
        pedido.situacao = sitAtual;
        aplicarFiltro();

        // Aqui vai a chamada real ao servidor (API/BD) quando o frontend estiver conectado
        // Ex.: enviarPedidoSituation(id, sitAtual);
        alert("Situação do pedido " + id + " atualizada para: " + sitAtual + " (simulação — aguarde conexão com o banco)");
    });
})();

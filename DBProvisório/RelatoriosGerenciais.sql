USE master
GO

--Total Vendido por Regiao

CREATE PROC totalVendidoRegiao 
AS

    SELECT
        nome_regiao,
        SUM(preco_produto) AS total_vendido

    FROM regiao
    INNER JOIN vendedor
    ON id_regiao = fk_id_regiao_vendedor

    INNER JOIN pedido
    ON id_vendedor = fk_id_vendedor_pedido

    INNER JOIN item_pedido
    ON id_pedido = fk_id_item_pedido

    INNER JOIN produto
    ON id_produto = fk_id_item_produto

    GROUP BY nome_regiao

exec totalVendidoRegiao

-- Total Vendido para cada Cliente

CREATE PROC TotalVendidoCliente
AS
    SELECT
        nome_cliente,
        SUM(preco_produto) AS Total_Comprado

    FROM cliente
    INNER JOIN pedido
    ON id_cliente = fk_id_cliente_pedido

    INNER JOIN item_pedido
    ON id_pedido = fk_id_item_pedido

    INNER JOIN produto
    ON id_produto = fk_id_item_produto

    GROUP BY nome_cliente

EXEC TotalVendidoCliente

--Total Vendido por Vendedor

CREATE PROC TotalVendidoVendedor
AS
    SELECT
        nome_vendedor,
        SUM(preco_produto) AS Total_Vendido

    FROM vendedor
    INNER JOIN pedido
    ON id_vendedor = fk_id_vendedor_pedido

    INNER JOIN item_pedido
    ON id_pedido = fk_id_item_pedido

    INNER JOIN produto
    ON id_produto = fk_id_item_produto

    GROUP BY nome_vendedor

EXEC TotalVendidoVendedor

--Clientes de Determinada Regiao
CREATE PROC ClientesPorRegiao
    @id_regiao INT
AS
    SELECT
        nome_cliente,
        nome_regiao

    FROM cliente
    INNER JOIN endereco
    ON id_cliente = fk_id_cliente_endereco

    INNER JOIN regiao
    ON id_regiao = fk_id_regiao_endereco

    WHERE id_regiao = @id_regiao

EXEC ClientesPorRegiao @id_regiao = 3

-- Total Vendido por Produto

CREATE PROC TotalVendidoProduto
AS
    SELECT
        nome_produto,
        SUM(preco_produto) AS Total_Vendido

    FROM produto
    INNER JOIN item_pedido
    ON id_produto = fk_id_item_produto

    GROUP BY nome_produto

EXEC TotalVendidoProduto


-- Extrato de comissao de cada vendedor separado por produto

CREATE PROC ExtratoComissaoVendedor
AS
    SELECT
        nome_vendedor,
        nome_produto,
        SUM(comissao) AS Total_Comissao

    FROM vendedor
    INNER JOIN pedido
    ON id_vendedor = fk_id_vendedor_pedido

    INNER JOIN item_pedido
    ON id_pedido = fk_id_item_pedido

    INNER JOIN produto
    ON id_produto = fk_id_item_produto

    GROUP BY nome_vendedor, nome_produto

EXEC ExtratoComissaoVendedor

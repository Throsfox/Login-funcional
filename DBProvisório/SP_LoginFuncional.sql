/* ============================================================
   PROCS SIMPLES - CentralDeAr (SQL Server 2016 SP1+)
   Baseadas exatamente no DDL enviado (nenhuma coluna inventada).
   Execute o DDL primeiro e depois este arquivo.
   CREATE OR ALTER cria a proc ou atualiza se ela já existir.

   OBS: senha_cliente é VARCHAR(50). Se for guardar hash (bcrypt etc.),
   rode antes:  ALTER TABLE cliente ALTER COLUMN senha_cliente VARCHAR(255) NOT NULL;
   (e ajuste o tipo do parâmetro @senha em usp_IncluirCliente)
============================================================ */

USE CentralDeAr;
GO

/* ------------------------------------------------------------
   1. LOGIN
   Retorna 1 linha se e-mail/senha baterem (cliente ou vendedor).
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_LoginUsuario
    @email VARCHAR(200),
    @senha VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_cliente AS id_pessoa, 'cliente' AS tipo, nome_cliente AS nome,
           email_cliente AS email
    FROM cliente
    WHERE email_cliente = @email AND senha_cliente = @senha

    UNION ALL

    SELECT id_vendedor, 'vendedor', nome_vendedor, email_vendedor
    FROM vendedor
    WHERE email_vendedor = @email AND senha_vendedor = @senha;
END
GO

/* ------------------------------------------------------------
   2. CADASTRO
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_IncluirCliente
    @nome         VARCHAR(50),
    @senha        VARCHAR(50),
    @cpf          VARCHAR(11),
    @email        VARCHAR(200),
    @telefone     VARCHAR(20),
    @data_nasc    DATE,
    @uf           VARCHAR(2),
    @cidade       VARCHAR(50),
    @bairro       VARCHAR(50),
    @rua          VARCHAR(50),
    @numero       INT = NULL,
    @cep          VARCHAR(11) = NULL,
    @complemento  VARCHAR(200) = NULL,
    @fk_id_regiao INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF EXISTS (SELECT 1 FROM cliente WHERE email_cliente = @email)
       OR EXISTS (SELECT 1 FROM vendedor WHERE email_vendedor = @email)
        THROW 50001, 'E-mail já cadastrado.', 1;

    IF EXISTS (SELECT 1 FROM cliente WHERE cpf_cliente = @cpf)
        THROW 50002, 'CPF já cadastrado.', 1;

    DECLARE @idade INT = DATEDIFF(YEAR, @data_nasc, GETDATE())
        - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, @data_nasc, GETDATE()), @data_nasc) > CAST(GETDATE() AS DATE)
               THEN 1 ELSE 0 END;

    IF @idade < 18
        THROW 50003, 'É necessário ter 18 anos ou mais.', 1;

    BEGIN TRAN;

    INSERT INTO cliente (nome_cliente, senha_cliente, cpf_cliente, email_cliente,
                         data_nasc_cliente, idade_cliente)
    VALUES (@nome, @senha, @cpf, @email, @data_nasc, @idade);

    DECLARE @id INT = SCOPE_IDENTITY();

    INSERT INTO endereco (uf, cidade, bairro, rua, num_casa, cep, complemento,
                          fk_id_cliente_endereco, fk_id_regiao_endereco)
    VALUES (@uf, @cidade, @bairro, @rua, @numero, @cep, @complemento, @id, @fk_id_regiao);

    INSERT INTO telefone (num_telefone, fk_id_cliente_telefone)
    VALUES (@telefone, @id);

    COMMIT TRAN;

    SELECT @id AS id_novo_cliente;
END
GO

CREATE OR ALTER PROCEDURE usp_IncluirVendedor
    @nome         VARCHAR(50),
    @email        VARCHAR(200),
    @senha        VARCHAR(255),
    @cnpj         VARCHAR(14),
    @nome_loja    VARCHAR(200),
    @fk_id_regiao INT,
    @data_nasc    DATE,
    @telefone     VARCHAR(20),
    @uf           VARCHAR(2),
    @cidade       VARCHAR(50),
    @bairro       VARCHAR(50),
    @rua          VARCHAR(50),
    @numero       INT = NULL,
    @cep          VARCHAR(11) = NULL,
    @complemento  VARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF EXISTS (SELECT 1 FROM cliente WHERE email_cliente = @email)
       OR EXISTS (SELECT 1 FROM vendedor WHERE email_vendedor = @email)
        THROW 50001, 'E-mail já cadastrado.', 1;

    IF EXISTS (SELECT 1 FROM vendedor WHERE cnpj_vendedor = @cnpj)
        THROW 50002, 'CNPJ já cadastrado.', 1;

    DECLARE @idade INT = DATEDIFF(YEAR, @data_nasc, GETDATE())
        - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, @data_nasc, GETDATE()), @data_nasc) > CAST(GETDATE() AS DATE)
               THEN 1 ELSE 0 END;

    IF @idade < 18
        THROW 50003, 'É necessário ter 18 anos ou mais.', 1;

    BEGIN TRAN;

    INSERT INTO vendedor (nome_vendedor, email_vendedor, senha_vendedor, cnpj_vendedor,
                          nome_loja_vendedor, fk_id_regiao_vendedor, data_nasc_vendedor, idade_vendedor)
    VALUES (@nome, @email, @senha, @cnpj, @nome_loja, @fk_id_regiao, @data_nasc, @idade);

    DECLARE @id INT = SCOPE_IDENTITY();

    INSERT INTO endereco (uf, cidade, bairro, rua, num_casa, cep, complemento,
                          fk_id_vendedor_endereco, fk_id_regiao_endereco)
    VALUES (@uf, @cidade, @bairro, @rua, @numero, @cep, @complemento, @id, @fk_id_regiao);

    INSERT INTO telefone (num_telefone, fk_id_vendedor_telefone)
    VALUES (@telefone, @id);

    COMMIT TRAN;

    SELECT @id AS id_novo_vendedor;
END
GO

/* ------------------------------------------------------------
   3. PERFIL
   Só altera o que for enviado (parâmetro NULL = mantém o valor).
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_AtualizarCliente
    @id_cliente  INT,
    @nome        VARCHAR(50)  = NULL,
    @senha       VARCHAR(50)  = NULL,
    @email       VARCHAR(200) = NULL,
    @telefone    VARCHAR(20)  = NULL,
    @uf          VARCHAR(2)   = NULL,
    @cidade      VARCHAR(50)  = NULL,
    @bairro      VARCHAR(50)  = NULL,
    @rua         VARCHAR(50)  = NULL,
    @numero      INT          = NULL,
    @cep         VARCHAR(11)  = NULL,
    @complemento VARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NOT EXISTS (SELECT 1 FROM cliente WHERE id_cliente = @id_cliente)
        THROW 50010, 'Cliente não encontrado.', 1;

    IF @email IS NOT NULL AND (
          EXISTS (SELECT 1 FROM cliente  WHERE email_cliente  = @email AND id_cliente <> @id_cliente)
       OR EXISTS (SELECT 1 FROM vendedor WHERE email_vendedor = @email))
        THROW 50001, 'E-mail já utilizado por outra conta.', 1;

    BEGIN TRAN;

    UPDATE cliente
    SET nome_cliente  = ISNULL(@nome, nome_cliente),
        senha_cliente = ISNULL(@senha, senha_cliente),
        email_cliente = ISNULL(@email, email_cliente)
    WHERE id_cliente = @id_cliente;

    UPDATE endereco
    SET uf          = ISNULL(@uf, uf),
        cidade      = ISNULL(@cidade, cidade),
        bairro      = ISNULL(@bairro, bairro),
        rua         = ISNULL(@rua, rua),
        num_casa    = ISNULL(@numero, num_casa),
        cep         = ISNULL(@cep, cep),
        complemento = ISNULL(@complemento, complemento)
    WHERE fk_id_cliente_endereco = @id_cliente;

    UPDATE telefone
    SET num_telefone = ISNULL(@telefone, num_telefone)
    WHERE fk_id_cliente_telefone = @id_cliente;

    COMMIT TRAN;
END
GO

CREATE OR ALTER PROCEDURE usp_AtualizarVendedor
    @id_vendedor  INT,
    @nome         VARCHAR(50)  = NULL,
    @senha        VARCHAR(255) = NULL,
    @email        VARCHAR(200) = NULL,
    @nome_loja    VARCHAR(200) = NULL,
    @fk_id_regiao INT          = NULL,
    @telefone     VARCHAR(20)  = NULL,
    @uf           VARCHAR(2)   = NULL,
    @cidade       VARCHAR(50)  = NULL,
    @bairro       VARCHAR(50)  = NULL,
    @rua          VARCHAR(50)  = NULL,
    @numero       INT          = NULL,
    @cep          VARCHAR(11)  = NULL,
    @complemento  VARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NOT EXISTS (SELECT 1 FROM vendedor WHERE id_vendedor = @id_vendedor)
        THROW 50010, 'Vendedor não encontrado.', 1;

    IF @email IS NOT NULL AND (
          EXISTS (SELECT 1 FROM vendedor WHERE email_vendedor = @email AND id_vendedor <> @id_vendedor)
       OR EXISTS (SELECT 1 FROM cliente  WHERE email_cliente  = @email))
        THROW 50001, 'E-mail já utilizado por outra conta.', 1;

    BEGIN TRAN;

    UPDATE vendedor
    SET nome_vendedor         = ISNULL(@nome, nome_vendedor),
        senha_vendedor        = ISNULL(@senha, senha_vendedor),
        email_vendedor        = ISNULL(@email, email_vendedor),
        nome_loja_vendedor    = ISNULL(@nome_loja, nome_loja_vendedor),
        fk_id_regiao_vendedor = ISNULL(@fk_id_regiao, fk_id_regiao_vendedor)
    WHERE id_vendedor = @id_vendedor;

    UPDATE endereco
    SET uf          = ISNULL(@uf, uf),
        cidade      = ISNULL(@cidade, cidade),
        bairro      = ISNULL(@bairro, bairro),
        rua         = ISNULL(@rua, rua),
        num_casa    = ISNULL(@numero, num_casa),
        cep         = ISNULL(@cep, cep),
        complemento = ISNULL(@complemento, complemento),
        fk_id_regiao_endereco = ISNULL(@fk_id_regiao, fk_id_regiao_endereco)
    WHERE fk_id_vendedor_endereco = @id_vendedor;

    UPDATE telefone
    SET num_telefone = ISNULL(@telefone, num_telefone)
    WHERE fk_id_vendedor_telefone = @id_vendedor;

    COMMIT TRAN;
END
GO

/* ------------------------------------------------------------
   4. PRODUTOS (catálogo)
   situacao_produto: 'ativo' ou 'descontinuado'
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_ListarProdutos
    @pesquisa     VARCHAR(100) = NULL,
    @tipo_produto VARCHAR(50)  = NULL,
    @situacao     VARCHAR(20)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_produto, tipo_produto, nome_produto, marca_produto, preco_produto,
           descricao_produto, url_imagem, modelo_produto, situacao_produto
    FROM produto
    WHERE (@tipo_produto IS NULL OR tipo_produto = @tipo_produto)
      AND (@situacao IS NULL OR situacao_produto = @situacao)
      AND (@pesquisa IS NULL
           OR nome_produto   LIKE '%' + @pesquisa + '%'
           OR marca_produto  LIKE '%' + @pesquisa + '%'
           OR modelo_produto LIKE '%' + @pesquisa + '%')
    ORDER BY nome_produto;
END
GO

CREATE OR ALTER PROCEDURE usp_ConsultarProdutoPorId
    @id_produto INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_produto, tipo_produto, nome_produto, marca_produto, preco_produto,
           descricao_produto, url_imagem, modelo_produto, situacao_produto
    FROM produto
    WHERE id_produto = @id_produto;
END
GO

CREATE OR ALTER PROCEDURE usp_IncluirProduto
    @tipo_produto      VARCHAR(50),
    @nome_produto      VARCHAR(50),
    @marca_produto     VARCHAR(50)   = NULL,
    @preco_produto     NUMERIC(10,2),
    @descricao_produto VARCHAR(4000) = NULL,
    @url_imagem        VARCHAR(500)  = NULL,
    @modelo_produto    VARCHAR(50)   = NULL,
    @situacao_produto  VARCHAR(20)   = 'ativo'
AS
BEGIN
    SET NOCOUNT ON;

    IF @preco_produto <= 0
        THROW 50020, 'Preço deve ser maior que zero.', 1;
    IF @situacao_produto NOT IN ('ativo', 'descontinuado')
        THROW 50021, 'Situação inválida (use ativo ou descontinuado).', 1;

    INSERT INTO produto (tipo_produto, nome_produto, marca_produto, preco_produto,
                         descricao_produto, url_imagem, modelo_produto, situacao_produto)
    VALUES (@tipo_produto, @nome_produto, @marca_produto, @preco_produto,
            @descricao_produto, @url_imagem, @modelo_produto, @situacao_produto);

    SELECT SCOPE_IDENTITY() AS id_novo_produto;
END
GO

CREATE OR ALTER PROCEDURE usp_AtualizarProduto
    @id_produto        INT,
    @tipo_produto      VARCHAR(50),
    @nome_produto      VARCHAR(50),
    @marca_produto     VARCHAR(50)   = NULL,
    @preco_produto     NUMERIC(10,2),
    @descricao_produto VARCHAR(4000) = NULL,
    @url_imagem        VARCHAR(500)  = NULL,
    @modelo_produto    VARCHAR(50)   = NULL,
    @situacao_produto  VARCHAR(20)   = 'ativo'
AS
BEGIN
    SET NOCOUNT ON;

    IF @preco_produto <= 0
        THROW 50020, 'Preço deve ser maior que zero.', 1;
    IF @situacao_produto NOT IN ('ativo', 'descontinuado')
        THROW 50021, 'Situação inválida (use ativo ou descontinuado).', 1;

    UPDATE produto
    SET tipo_produto      = @tipo_produto,
        nome_produto      = @nome_produto,
        marca_produto     = @marca_produto,
        preco_produto     = @preco_produto,
        descricao_produto = @descricao_produto,
        url_imagem        = @url_imagem,
        modelo_produto    = @modelo_produto,
        situacao_produto  = @situacao_produto
    WHERE id_produto = @id_produto;

    IF @@ROWCOUNT = 0
        THROW 50022, 'Produto não encontrado.', 1;
END
GO

/* ------------------------------------------------------------
   5. OFERTAS (vendedor_produto = quais produtos a loja vende)
   Como a tabela só tem as duas FKs, o preço é o de produto.preco_produto.
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_AnunciarProduto
    @id_vendedor INT,
    @id_produto  INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM vendedor WHERE id_vendedor = @id_vendedor)
        THROW 50030, 'Vendedor não encontrado.', 1;
    IF NOT EXISTS (SELECT 1 FROM produto WHERE id_produto = @id_produto AND situacao_produto = 'ativo')
        THROW 50031, 'Produto inexistente ou descontinuado.', 1;
    IF EXISTS (SELECT 1 FROM vendedor_produto
               WHERE fk_id_vendedor = @id_vendedor AND fk_id_produto = @id_produto)
        THROW 50032, 'Esta loja já anuncia este produto.', 1;

    INSERT INTO vendedor_produto (fk_id_vendedor, fk_id_produto)
    VALUES (@id_vendedor, @id_produto);

    SELECT SCOPE_IDENTITY() AS id_oferta;
END
GO

CREATE OR ALTER PROCEDURE usp_RemoverAnuncio
    @id_vendedor INT,
    @id_produto  INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM vendedor_produto
    WHERE fk_id_vendedor = @id_vendedor AND fk_id_produto = @id_produto;

    IF @@ROWCOUNT = 0
        THROW 50033, 'Anúncio não encontrado.', 1;
END
GO

CREATE OR ALTER PROCEDURE usp_ListarOfertas
    @loja_id      INT           = NULL,
    @regiao_id    INT           = NULL,
    @tipo_produto VARCHAR(50)   = NULL,
    @preco_min    NUMERIC(10,2) = NULL,
    @preco_max    NUMERIC(10,2) = NULL,
    @pesquisa     VARCHAR(100)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT vp.id_vendedor_produto AS id_oferta,
           p.id_produto, p.tipo_produto, p.nome_produto, p.marca_produto,
           p.modelo_produto, p.preco_produto, p.descricao_produto, p.url_imagem,
           v.id_vendedor AS loja_id, v.nome_loja_vendedor AS loja_nome,
           r.id_regiao AS regiao_id, r.nome_regiao AS regiao_nome
    FROM vendedor_produto vp
    INNER JOIN produto  p ON p.id_produto  = vp.fk_id_produto
    INNER JOIN vendedor v ON v.id_vendedor = vp.fk_id_vendedor
    LEFT  JOIN regiao   r ON r.id_regiao   = v.fk_id_regiao_vendedor
    WHERE p.situacao_produto = 'ativo'
      AND (@loja_id      IS NULL OR v.id_vendedor = @loja_id)
      AND (@regiao_id    IS NULL OR r.id_regiao   = @regiao_id)
      AND (@tipo_produto IS NULL OR p.tipo_produto = @tipo_produto)
      AND (@preco_min    IS NULL OR p.preco_produto >= @preco_min)
      AND (@preco_max    IS NULL OR p.preco_produto <= @preco_max)
      AND (@pesquisa IS NULL
           OR p.nome_produto   LIKE '%' + @pesquisa + '%'
           OR p.marca_produto  LIKE '%' + @pesquisa + '%'
           OR p.modelo_produto LIKE '%' + @pesquisa + '%')
    ORDER BY p.nome_produto, p.preco_produto;
END
GO

/* ------------------------------------------------------------
   6. PEDIDOS (1 produto por pedido, como nas procs originais)
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_RealizarPedido
    @id_cliente  INT,
    @id_vendedor INT,
    @id_produto  INT,
    @quantidade  INT,
    @comissao    NUMERIC(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NOT EXISTS (SELECT 1 FROM cliente WHERE id_cliente = @id_cliente)
        THROW 50040, 'Cliente não encontrado.', 1;
    IF @quantidade <= 0
        THROW 50041, 'Quantidade inválida.', 1;

    -- o vendedor precisa anunciar o produto e o produto precisa estar ativo
    DECLARE @preco NUMERIC(10,2);

    SELECT @preco = p.preco_produto
    FROM vendedor_produto vp
    INNER JOIN produto p ON p.id_produto = vp.fk_id_produto
    WHERE vp.fk_id_vendedor = @id_vendedor
      AND vp.fk_id_produto  = @id_produto
      AND p.situacao_produto = 'ativo';

    IF @preco IS NULL
        THROW 50042, 'Esta loja não vende este produto (ou ele está descontinuado).', 1;

    DECLARE @total NUMERIC(10,2) = @preco * @quantidade;

    BEGIN TRAN;

    INSERT INTO pedido (fk_id_cliente_pedido, fk_id_vendedor_pedido, total_pedido)
    VALUES (@id_cliente, @id_vendedor, @total);

    DECLARE @id_pedido INT = SCOPE_IDENTITY();

    INSERT INTO item_pedido (comissao, quantidade, preco_unitario, fk_id_item_produto, fk_id_item_pedido)
    VALUES (@comissao, @quantidade, @preco, @id_produto, @id_pedido);

    COMMIT TRAN;

    SELECT @id_pedido AS id_novo_pedido;
END
GO

CREATE OR ALTER PROCEDURE usp_ListarPedidosDoCliente
    @id_cliente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT pe.id_pedido, pe.data_pedido, pe.total_pedido, pe.situacao_pedido,
           pr.id_produto, pr.nome_produto,
           v.nome_loja_vendedor AS loja,
           ip.quantidade, ip.preco_unitario
    FROM pedido pe
    INNER JOIN item_pedido ip ON ip.fk_id_item_pedido = pe.id_pedido
    INNER JOIN produto pr     ON pr.id_produto = ip.fk_id_item_produto
    INNER JOIN vendedor v     ON v.id_vendedor = pe.fk_id_vendedor_pedido
    WHERE pe.fk_id_cliente_pedido = @id_cliente
    ORDER BY pe.data_pedido DESC;
END
GO

CREATE OR ALTER PROCEDURE usp_ListarPedidosDaLoja
    @id_vendedor     INT,
    @situacao_pedido VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT pe.id_pedido, pe.data_pedido, pe.total_pedido, pe.situacao_pedido,
           c.nome_cliente, c.email_cliente,
           pr.id_produto, pr.nome_produto,
           ip.quantidade, ip.preco_unitario
    FROM pedido pe
    INNER JOIN item_pedido ip ON ip.fk_id_item_pedido = pe.id_pedido
    INNER JOIN produto pr     ON pr.id_produto = ip.fk_id_item_produto
    INNER JOIN cliente c      ON c.id_cliente = pe.fk_id_cliente_pedido
    WHERE pe.fk_id_vendedor_pedido = @id_vendedor
      AND (@situacao_pedido IS NULL OR pe.situacao_pedido = @situacao_pedido)
    ORDER BY pe.data_pedido DESC;
END
GO

-- Situações aceitas (CHECK da tabela): Pendente, Enviado, Entregue, Cancelado
CREATE OR ALTER PROCEDURE usp_AtualizarSituacaoPedido
    @id_pedido       INT,
    @situacao_pedido VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF @situacao_pedido NOT IN ('Pendente', 'Enviado', 'Entregue', 'Cancelado')
        THROW 50050, 'Situação de pedido inválida.', 1;

    UPDATE pedido
    SET situacao_pedido = @situacao_pedido
    WHERE id_pedido = @id_pedido;

    IF @@ROWCOUNT = 0
        THROW 50051, 'Pedido não encontrado.', 1;
END
GO

/* ------------------------------------------------------------
   7. LOJAS E REGIÕES
------------------------------------------------------------ */
CREATE OR ALTER PROCEDURE usp_ListarLojas
AS
BEGIN
    SET NOCOUNT ON;

    SELECT v.id_vendedor AS loja_id, v.nome_vendedor AS loja_responsavel,
           v.nome_loja_vendedor AS loja_nome,
           r.id_regiao, r.nome_regiao,
           e.uf, e.cidade, e.bairro, e.rua, e.num_casa, e.cep, e.complemento,
           t.num_telefone
    FROM vendedor v
    LEFT JOIN regiao r ON r.id_regiao = v.fk_id_regiao_vendedor
    OUTER APPLY (SELECT TOP 1 * FROM endereco WHERE fk_id_vendedor_endereco = v.id_vendedor ORDER BY id_endereco) e
    OUTER APPLY (SELECT TOP 1 * FROM telefone WHERE fk_id_vendedor_telefone = v.id_vendedor ORDER BY id_telefone) t
    ORDER BY v.nome_loja_vendedor;
END
GO

CREATE OR ALTER PROCEDURE usp_ConsultarLoja
    @id_loja INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT v.id_vendedor AS loja_id, v.nome_vendedor AS loja_responsavel,
           v.nome_loja_vendedor AS loja_nome,
           r.id_regiao, r.nome_regiao,
           e.uf, e.cidade, e.bairro, e.rua, e.num_casa, e.cep, e.complemento,
           t.num_telefone
    FROM vendedor v
    LEFT JOIN regiao r ON r.id_regiao = v.fk_id_regiao_vendedor
    OUTER APPLY (SELECT TOP 1 * FROM endereco WHERE fk_id_vendedor_endereco = v.id_vendedor ORDER BY id_endereco) e
    OUTER APPLY (SELECT TOP 1 * FROM telefone WHERE fk_id_vendedor_telefone = v.id_vendedor ORDER BY id_telefone) t
    WHERE v.id_vendedor = @id_loja;
END
GO

CREATE OR ALTER PROCEDURE usp_ListarRegioes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_regiao, nome_regiao, descricao_regiao
    FROM regiao
    ORDER BY nome_regiao;
END
GO

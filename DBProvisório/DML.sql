/* ==========================================
   1. INSERINDO AS REGIÕES DE ATUAÇÃO
   ========================================== */

INSERT INTO regiao (nome_regiao, descricao_regiao) VALUES
('Grande Vitória', 'Região metropolitana incluindo Vila Velha, Vitória, Cariacica, Serra e Fundão'),
('Região Sul', 'Abrangendo Cachoeiro de Itapemirim, Guarapari, Marataízes, Piúma e Castelo'),
('Região Norte', 'Abrangendo Linhares, Colatina, Jaguaré, Nova Venécia e São Mateus'),
('Região Centro-Serrana', 'Abrangendo Domingos Martins, Venda Nova do Imigrante, Afonso Cláudio, Santa Maria de Jetibá e Santa Teresa');


/* ==========================================
   2. GERANDO 200 CLIENTES
   ========================================== */

DECLARE @i INT = 1;
DECLARE @nome_c VARCHAR(50), @sobrenome_c VARCHAR(50);

WHILE @i <= 200
BEGIN

    SET @nome_c = CHOOSE(1 + ((@i - 1) % 20),
        'Lucas', 'Gabriel', 'Matheus', 'Beatriz', 'Larissa',
        'Mariana', 'Monkey D.', 'Carlos', 'Ana', 'João',
        'Julia', 'Pedro', 'Bruna', 'Rafael', 'Camila',
        'Felipe', 'Amanda', 'Emerson', 'Letícia', 'Bruno'
    );

    SET @sobrenome_c = CHOOSE(1 + ((@i * 3) % 20),
        'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues',
        'Ferreira', 'Alves', 'Pereira', 'Lima', 'Müller',
        'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Luffy',
        'Almeida', 'Lopes', 'Soares', 'Barbosa', 'Rocha'
    );

    INSERT INTO cliente (
        nome_cliente,
        senha_cliente,
        cpf_cliente,
        email_cliente,
        data_nasc_cliente,
        idade_cliente
    )
    VALUES (
        CONCAT(@nome_c, ' ', @sobrenome_c, ' ', @i),
        CONCAT('senha', @i),
        RIGHT('00000000000' + CAST(1000000000 + @i AS VARCHAR(11)), 11),
        CONCAT('cliente', @i, '@email.com'),
        DATEADD(year, -(18 + (@i % 40)), '2006-01-01'),
        18 + (@i % 40)
    );

    SET @i = @i + 1;

END;


/* ==========================================
   3. GERANDO 200 VENDEDORES
   ========================================== */

DECLARE @j INT = 1;
DECLARE @nome_v VARCHAR(50), @sobrenome_v VARCHAR(50);

WHILE @j <= 200
BEGIN

    SET @nome_v = CHOOSE(1 + ((@j * 7) % 20),
        'Marcos', 'Fernanda', 'Rodrigo', 'Patrícia', 'Thiago',
        'Vanessa', 'Eduardo', 'Camila', 'Renato', 'Tatiane',
        'Augusto', 'Marcelo', 'Daniela', 'Leandro', 'Priscila',
        'Alexandre', 'Juliana', 'Ricardo', 'Cristiane', 'Roberto'
    );

    SET @sobrenome_v = CHOOSE(1 + ((@j * 5) % 20),
        'Monteiro', 'Nogueira', 'Cardoso', 'Araújo', 'Cavalcanti',
        'Melo', 'Barros', 'Campos', 'Teixeira', 'Correia',
        'Farias', 'Freitas', 'Vieira', 'Pinto', 'Mendes',
        'Dragon', 'Ramos', 'Machado', 'Duarte', 'Silveira'
    );

    INSERT INTO vendedor (
        nome_vendedor,
        email_vendedor,
        senha_vendedor,
        cnpj_vendedor,
        fk_id_regiao_vendedor,
        data_nasc_vendedor,
        idade_vendedor
    )
    VALUES (
        CONCAT(@nome_v, ' ', @sobrenome_v),
        LOWER(CONCAT(@nome_v, '.', @sobrenome_v, @j, '@centraldoar.com')),
        CONCAT('vend', @j),
        RIGHT('00000000000000' + CAST(10000000000000 + @j AS VARCHAR(14)), 14),
        ((@j - 1) % 4) + 1,
        DATEADD(year, -(22 + (@j % 35)), '2006-01-01'),
        22 + (@j % 35)
    );

    SET @j = @j + 1;

END;


/* ==========================================
   4. INSERINDO PRODUTOS
   ========================================== */

INSERT INTO produto (
    tipo_produto,
    nome_produto,
    marca_produto,
    preco_produto,
    descricao_produto,
    url_imagem,
    modelo_produto,
    situacao_produto
)
VALUES
(
    'ar-condicionado',
    'Ar Condicionado Split',
    'Samsung',
    2000.00,
    'Ar condicionado potente',
    NULL,
    'Inverter 12000 BTUs',
    'ativo'
),
(
    'acessorio',
    'Ventilador',
    'Samsung',
    300.00,
    'Ventilador de chão, cor preta',
    NULL,
    'Modelo V300',
    'ativo'
),
(
    'climatizador',
    'Umidificador',
    'Matheus Umidificadores',
    500.00,
    'Umidificador muito bom',
    NULL,
    'Modelo U500',
    'ativo'
);


/* ==========================================
   5. INSERINDO PEDIDOS
   ========================================== */

INSERT INTO pedido (
    fk_id_cliente_pedido,
    fk_id_vendedor_pedido,
    data_pedido,
    total_pedido,
    situacao_pedido
)
VALUES
(1, 1, GETDATE(), 2000.00, 'Pendente'),
(2, 2, GETDATE(), 300.00, 'Enviado'),
(1, 1, GETDATE(), 500.00, 'Entregue'),
(1, 2, GETDATE(), 4000.00, 'Pendente'),
(1, 1, GETDATE(), 300.00, 'Enviado'),
(2, 3, GETDATE(), 500.00, 'Entregue'),
(3, 1, GETDATE(), 2000.00, 'Cancelado');


/* ==========================================
   6. INSERINDO ITENS DOS PEDIDOS
   ========================================== */

INSERT INTO item_pedido (
    comissao,
    quantidade,
    preco_unitario,
    fk_id_item_produto,
    fk_id_item_pedido
)
VALUES
(NULL, 1, 2000.00, 1, 1),
(NULL, 1, 300.00, 2, 2),
(100.00, 1, 500.00, 3, 3),
(50.00, 2, 2000.00, 1, 4),
(NULL, 1, 300.00, 2, 5),
(NULL, 1, 500.00, 3, 6),
(NULL, 1, 2000.00, 1, 7);


/* ==========================================
   7. ADICIONANDO ENDEREÇOS AOS CLIENTES
   ========================================== */

DECLARE @k INT = 1;

WHILE @k <= 200
BEGIN

    INSERT INTO endereco (
        uf,
        cidade,
        bairro,
        rua,
        num_casa,
        fk_id_cliente_endereco,
        fk_id_regiao_endereco
    )
    VALUES (
        'ES',
        'Vila Velha',
        'Centro',
        CONCAT('Rua ', @k),
        @k,
        @k,
        ((@k - 1) % 4) + 1
    );

    SET @k = @k + 1;

END;
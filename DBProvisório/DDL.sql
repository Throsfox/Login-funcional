/*DDL
Criação da estrutura das tabelas conforme o modelo lógico decido*/

CREATE TABLE cliente (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    nome_cliente VARCHAR(50) NOT NULL,
    senha_cliente VARCHAR(50) NOT NULL,
    cpf_cliente VARCHAR(11) NOT NULL,
    email_cliente VARCHAR(200) NOT NULL,
    data_nasc_cliente DATE NOT NULL,
    idade_cliente INT NOT NULL
);


CREATE TABLE regiao (
    id_regiao INT IDENTITY(1,1) PRIMARY KEY,
    nome_regiao VARCHAR(50) NOT NULL,
    descricao_regiao VARCHAR(255)
);


CREATE TABLE produto (
    id_produto INT IDENTITY(1,1) PRIMARY KEY,
    tipo_produto VARCHAR(50) NOT NULL,
    nome_produto VARCHAR(50) NOT NULL,
    marca_produto VARCHAR(50),
    preco_produto NUMERIC(10,2) NOT NULL,
    descricao_produto VARCHAR(4000),
    url_imagem VARCHAR(500),
    modelo_produto VARCHAR(50),
    situacao_produto VARCHAR(20) NOT NULL DEFAULT 'ativo'
);


CREATE TABLE vendedor (
    id_vendedor INT IDENTITY(1,1) PRIMARY KEY,
    nome_vendedor VARCHAR(50) NOT NULL,
    email_vendedor VARCHAR(200) NOT NULL,
    senha_vendedor VARCHAR(255) NOT NULL,
    cnpj_vendedor VARCHAR(14) NOT NULL,
    nome_loja_vendedor VARCHAR(200) NOT NULL,
    fk_id_regiao_vendedor INT FOREIGN KEY REFERENCES regiao(id_regiao),
    data_nasc_vendedor DATE NOT NULL,
    idade_vendedor INT NOT NULL
);


CREATE TABLE pedido (
    id_pedido INT IDENTITY(1,1) PRIMARY KEY,
    fk_id_cliente_pedido INT FOREIGN KEY REFERENCES cliente(id_cliente),
    fk_id_vendedor_pedido INT FOREIGN KEY REFERENCES vendedor(id_vendedor),
    data_pedido DATETIME NOT NULL DEFAULT GETDATE(),
    total_pedido NUMERIC(10,2) NOT NULL DEFAULT 0,
    situacao_pedido VARCHAR(20) NOT NULL DEFAULT 'Pendente',

    CHECK (situacao_pedido IN ('Pendente', 'Enviado', 'Entregue', 'Cancelado'))
);


CREATE TABLE endereco (
    id_endereco INT IDENTITY(1,1) PRIMARY KEY,
    uf VARCHAR(2) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    rua VARCHAR(50) NOT NULL,
    num_casa INT,
    cep VARCHAR(11),
    complemento VARCHAR(200),
    fk_id_cliente_endereco INT FOREIGN KEY REFERENCES cliente(id_cliente),
    fk_id_vendedor_endereco INT FOREIGN KEY REFERENCES vendedor(id_vendedor),
    fk_id_regiao_endereco INT FOREIGN KEY REFERENCES regiao(id_regiao)
);


CREATE TABLE telefone (
    id_telefone INT IDENTITY(1,1) PRIMARY KEY,
    num_telefone VARCHAR(20) NOT NULL,
    fk_id_cliente_telefone INT FOREIGN KEY REFERENCES cliente(id_cliente),
    fk_id_vendedor_telefone INT FOREIGN KEY REFERENCES vendedor(id_vendedor)
);
/*Tabelas criadas a partir de relacionamentos N:N*/
CREATE TABLE vendedor_produto (
    id_vendedor_produto INT IDENTITY(1,1) PRIMARY KEY,
    fk_id_vendedor INT FOREIGN KEY REFERENCES vendedor(id_vendedor),
    fk_id_produto INT FOREIGN KEY REFERENCES produto(id_produto)
);


CREATE TABLE item_pedido (
    id_item_pedido INT IDENTITY(1,1) PRIMARY KEY,
    comissao NUMERIC(10,2),
    quantidade INT NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    fk_id_item_produto INT FOREIGN KEY REFERENCES produto(id_produto),
    fk_id_item_pedido INT FOREIGN KEY REFERENCES pedido(id_pedido),

    CHECK (quantidade > 0),
    CHECK (preco_unitario >= 0)
);
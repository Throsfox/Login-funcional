# Central de Ar LTDA

**Sistema de vendas online simulado** — projeto da matéria **BD2**, desenvolvido para praticar modelagem relacional, banco de dados SQL Server e integração com linguagem de programação.

## O que é esse sistema?

É um sistema de comércio eletrônico **simplificado**, onde a cada vendedor está associada uma loja (conta de vendedor = conta da loja). Permite:

- Login e cadastro de **clientes**, **vendedores** (lojas) e **administrador**;
- Catálogo de produtos com pesquisa por modelo, marca, tipo e região;
- Cada vendedor anuncia produtos na sua loja com preço e estoque;
- Pedidos de compra e controle de status (Pendente → Enviado → Entregue / Cancelado);
- Painéis de gerenciamento: catálogo do administrador e painel da loja do vendedor.

## Pontos principais estudados

- **Modelagem de banco de dados**: tabelas `cliente`, `vendedor`, `produto`, `pedido`, `item_pedido`, `endereco`, `telefone`, `regiao`, `vendedor_produto`; relacionamentos, chaves estrangeiras e normalização.
- **Stored procedures (SQL Server)**: login, cadastro, atualização de perfil, listagem de ofertas, consulta de produto, controle de pedidos e gerenciamento de lojas/regiões.
- **Integração front-end**: páginas HTML/CSS/JS, verificação de sessão e navegação entre telas.
- **Arquitetura sugerida**: separação de camadas — banco (SQL Server) → API (Flask) → front-end (JS).

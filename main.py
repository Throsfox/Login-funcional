# -*- coding: utf-8 -*-
"""
Sistema de E-commerce - Central de Ar
Backend: Flask + pyodbc (SQL Server)
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(BASE_DIR))

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS  # [NOVO] necessário para o front chamar a API
from database.connection import conectar_banco
from werkzeug.utils import safe_join

app = Flask(__name__, static_folder=None)

# [NOVO] Libera CORS para o front (Live Server, file://, etc.)
CORS(app, resources={r"/api/*": {"origins": "*"}})

STATIC_DIR = BASE_DIR / "static"
if not STATIC_DIR.exists():
    STATIC_DIR = BASE_DIR


def obter_conexao():
    return conectar_banco()


def executar_sp(sp_name, params=None):
    """
    [CORRIGIDO] Executa uma stored procedure usando parâmetros NOMEADOS
    (@param=?), o que evita erros de ordem/quantidade de parâmetros.
    Também faz commit para INSERT/UPDATE/DELETE e unifica a leitura de resultados.
    """
    conn = obter_conexao()
    if conn is None:
        return None
    try:
        cursor = conn.cursor()
        params = params or {}
        if params:
            # Gera: @email=?, @senha=?
            named = ", ".join([f"@{k}=?" for k in params.keys()])
            cursor.execute(f"EXEC {sp_name} {named}", tuple(params.values()))
        else:
            cursor.execute(f"EXEC {sp_name}")

        conn.commit()  # [CORRIGIDO] necessário para operações de escrita

        if cursor.description:
            columns = [c[0] for c in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return []
    except Exception as e:
        print(f"Erro executando {sp_name}: {e}")
        try:
            conn.rollback()
        except Exception:
            pass
        return None
    finally:
        conn.close()


# [CORRIGIDO] obter_resultados agora é apenas um alias de executar_sp.
# Assim evitamos dois caminhos diferentes para a mesma operação.
def obter_resultados(sp_name, params=None):
    return executar_sp(sp_name, params)


@app.route("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")


@app.route("/<path:filename>")
def serve_estatico(filename):
    file_path = BASE_DIR / filename
    if file_path.exists() and file_path.is_file():
        return send_from_directory(str(BASE_DIR), filename)
    if STATIC_DIR.exists():
        safe_path = safe_join(str(STATIC_DIR), filename)
        if safe_path:
            return send_from_directory(str(STATIC_DIR), filename)
    return "Página não encontrada", 404


# ---------------------------------------------------------------------------
# LOGIN
# ---------------------------------------------------------------------------
@app.route("/api/usuarios/login", methods=["POST"])
def api_login():
    # [CORRIGIDO] get_json(silent=True) evita erro 400 se o body vier vazio
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip()
    senha = data.get("senha", "")
    if not email or not senha:
        return jsonify({"error": "E-mail e senha são obrigatórios."}), 400

    resultado = executar_sp("usp_LoginUsuario", {"email": email, "senha": senha})
    if resultado is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    if len(resultado) == 0:
        return jsonify({"error": "E-mail ou senha incorretos."}), 401

    usuario = resultado[0]

    return jsonify({
        "success": True,
        "usuario": {
            "id": usuario.get("id_pessoa"),
            "tipo": usuario.get("tipo"),
            "nome": usuario.get("nome"),
            "email": usuario.get("email"),
            "loja_id": usuario.get("loja_id"),
            "loja_nome": usuario.get("loja_nome"),
            "cpf": usuario.get("cpf"),
            "cnpj": usuario.get("cnpj"),
            "data_nascimento": usuario.get("data_nascimento"),
            "idade": usuario.get("idade"),
            "regiao_id": usuario.get("regiao_id")
        }
    })


@app.route("/api/usuario/email", methods=["GET"])
def api_usuario_email():
    email = request.args.get("email", "").strip()
    if not email:
        return jsonify({"error": "E-mail é obrigatório."}), 400
    return jsonify({
        "error": "Rota não implementada. Crie usp_ObterUsuarioPorEmail no SQL Server.",
        "mensagem": "Fazer login via /api/usuarios/login"
    }), 404


# ---------------------------------------------------------------------------
# CADASTRO
# ---------------------------------------------------------------------------
@app.route("/api/clientes/cadastrar", methods=["POST"])
def api_cadastrar_cliente():
    data = request.get_json(silent=True) or {}
    nome = data.get("nome", "").strip()
    senha = data.get("senha", "")
    cpf = data.get("cpf", "").strip()
    email = data.get("email", "").strip()
    telefone = data.get("telefone", "").strip()
    data_nasc = data.get("data_nasc")
    uf = data.get("uf", "").strip()
    cidade = data.get("cidade", "").strip()
    bairro = data.get("bairro", "").strip()
    rua = data.get("rua", "").strip()
    numero = data.get("numero")
    cep = data.get("cep", "").strip()
    complemento = data.get("complemento", "")
    fk_id_regiao = data.get("fk_id_regiao")

    if not all([nome, senha, cpf, email, telefone, data_nasc, uf, cidade, bairro, rua]):
        return jsonify({"error": "Campos obrigatórios não preenchidos."}), 400

    params = {
        "nome": nome, "senha": senha, "cpf": cpf, "email": email,
        "telefone": telefone, "data_nasc": data_nasc, "uf": uf,
        "cidade": cidade, "bairro": bairro, "rua": rua,
        "numero": numero, "cep": cep, "complemento": complemento,
        "fk_id_regiao": fk_id_regiao
    }

    resultado = executar_sp("usp_IncluirCliente", params)
    if resultado is None:
        return jsonify({"error": "Erro ao cadastrar cliente. Verifique os dados."}), 500

    cliente = resultado[0] if resultado else {}

    return jsonify({
        "success": True,
        "message": "Cliente cadastrado com sucesso.",
        "id": cliente.get("id_novo_cliente")
    })


@app.route("/api/vendedores/cadastrar", methods=["POST"])
def api_cadastrar_vendedor():
    data = request.get_json(silent=True) or {}
    nome = data.get("nome", "").strip()
    email = data.get("email", "").strip()
    senha = data.get("senha", "")
    cnpj = data.get("cnpj", "").strip()
    nome_loja = data.get("nome_loja", "").strip()
    fk_id_regiao = data.get("fk_id_regiao")
    data_nasc = data.get("data_nasc")
    telefone = data.get("telefone", "").strip()
    uf = data.get("uf", "").strip()
    cidade = data.get("cidade", "").strip()
    bairro = data.get("bairro", "").strip()
    rua = data.get("rua", "").strip()
    numero = data.get("numero")
    cep = data.get("cep", "").strip()
    complemento = data.get("complemento", "")

    if not all([nome, email, senha, cnpj, nome_loja, data_nasc, fk_id_regiao,
                telefone, uf, cidade, bairro, rua]):
        return jsonify({"error": "Campos obrigatórios não preenchidos."}), 400

    params = {
        "nome": nome, "email": email, "senha": senha, "cnpj": cnpj,
        "nome_loja": nome_loja, "fk_id_regiao": fk_id_regiao,
        "data_nasc": data_nasc, "telefone": telefone, "uf": uf,
        "cidade": cidade, "bairro": bairro, "rua": rua,
        "numero": numero, "cep": cep, "complemento": complemento
    }

    resultado = executar_sp("usp_IncluirVendedor", params)
    if resultado is None:
        return jsonify({"error": "Erro ao cadastrar vendedor. Verifique os dados."}), 500

    vendedor = resultado[0] if resultado else {}

    return jsonify({
        "success": True,
        "message": "Vendedor cadastrado com sucesso.",
        "id": vendedor.get("id_novo_vendedor")
    })


@app.route("/api/perfil/atualizar", methods=["POST"])
def api_atualizar_perfil():
    data = request.get_json(silent=True) or {}
    tipo = data.get("tipo", "").strip()
    id_pessoa = data.get("id_pessoa")

    if tipo not in ("c", "v") or not id_pessoa:
        return jsonify({"error": "Tipo de usuário inválido."}), 400

    if tipo == "c":
        sp = "usp_AtualizarCliente"
        id_param = "id_cliente"
    else:
        sp = "usp_AtualizarVendedor"
        id_param = "id_vendedor"

    params = {
        id_param: id_pessoa,
        "nome": data.get("nome"),
        "senha": data.get("senha"),
        "email": data.get("email"),
        "telefone": data.get("telefone"),
        "uf": data.get("uf"),
        "cidade": data.get("cidade"),
        "bairro": data.get("bairro"),
        "rua": data.get("rua"),
        "numero": data.get("numero"),
        "cep": data.get("cep"),
        "complemento": data.get("complemento")
    }
    params = {k: v for k, v in params.items() if v is not None}

    if len(params) <= 1:
        return jsonify({"error": "Nenhum campo para atualizar."}), 400

    resultado = executar_sp(sp, params)
    if resultado is None:
        return jsonify({"error": "Erro ao atualizar perfil."}), 500

    return jsonify({"success": True, "message": "Perfil atualizado com sucesso."})


# ---------------------------------------------------------------------------
# LOJAS
# ---------------------------------------------------------------------------
@app.route("/api/lojas/listar", methods=["GET"])
def api_listar_lojas():
    resultados = executar_sp("usp_ListarLojas")
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "lojas": resultados})


@app.route("/api/lojas/consultar/<int:loja_id>", methods=["GET"])
def api_consultar_loja(loja_id):
    resultado = executar_sp("usp_ConsultarLoja", {"id_loja": loja_id})
    if resultado is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    if len(resultado) == 0:
        return jsonify({"error": "Loja não encontrada."}), 404
    return jsonify({"success": True, "loja": resultado[0]})


@app.route("/api/lojas/excluir", methods=["POST"])
def api_excluir_loja():
    data = request.get_json(silent=True) or {}
    id_vendedor = data.get("id_vendedor")
    id_produto = data.get("id_produto")

    if not id_vendedor or not id_produto:
        return jsonify({"error": "ID do vendedor e do produto são obrigatórios."}), 400

    params = {"id_vendedor": id_vendedor, "id_produto": id_produto}
    resultado = executar_sp("usp_RemoverAnuncio", params)
    if resultado is None:
        return jsonify({"error": "Erro ao remover anúncio."}), 500

    return jsonify({"success": True, "message": "Anúncio removido com sucesso."})


# ---------------------------------------------------------------------------
# REGIÕES
# ---------------------------------------------------------------------------
@app.route("/api/regioes/listar", methods=["GET"])
def api_listar_regioes():
    resultados = executar_sp("usp_ListarRegioes")
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "regioes": resultados})


# ---------------------------------------------------------------------------
# PRODUTOS
# ---------------------------------------------------------------------------
@app.route("/api/produtos/listar", methods=["GET"])
def api_listar_produtos():
    params = {}
    for campo in ("pesquisa", "tipo_produto", "situacao"):
        valor = request.args.get(campo)
        if valor:
            params[campo] = valor

    resultados = executar_sp("usp_ListarProdutos", params)
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "produtos": resultados})


@app.route("/api/produtos/consultar/<int:id_produto>", methods=["GET"])
def api_consultar_produto(id_produto):
    resultado = executar_sp("usp_ConsultarProdutoPorId", {"id_produto": id_produto})
    if resultado is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    if len(resultado) == 0:
        return jsonify({"error": "Produto não encontrado."}), 404
    return jsonify({"success": True, "produto": resultado[0]})


@app.route("/api/produtos/incluir", methods=["POST"])
def api_incluir_produto():
    data = request.get_json(silent=True) or {}
    tipo_produto = data.get("tipo_produto", "").strip()
    nome_produto = data.get("nome_produto", "").strip()
    marca_produto = data.get("marca_produto", "").strip()
    preco_produto = data.get("preco_produto")
    descricao_produto = data.get("descricao_produto", "")
    url_imagem = data.get("url_imagem", "")
    modelo_produto = data.get("modelo_produto", "").strip()
    situacao_produto = data.get("situacao_produto", "ativo")

    if not all([tipo_produto, nome_produto, preco_produto]):
        return jsonify({"error": "Tipo de produto, nome e preço são obrigatórios."}), 400

    params = {
        "tipo_produto": tipo_produto, "nome_produto": nome_produto,
        "marca_produto": marca_produto, "preco_produto": preco_produto,
        "descricao_produto": descricao_produto, "url_imagem": url_imagem,
        "modelo_produto": modelo_produto, "situacao_produto": situacao_produto
    }

    resultado = executar_sp("usp_IncluirProduto", params)
    if resultado is None:
        return jsonify({"error": "Erro ao cadastrar produto."}), 500

    produto = resultado[0] if resultado else {}

    return jsonify({
        "success": True,
        "message": "Produto cadastrado com sucesso.",
        "id": produto.get("id_novo_produto")
    })


@app.route("/api/produtos/atualizar", methods=["POST"])
def api_atualizar_produto():
    data = request.get_json(silent=True) or {}
    id_produto = data.get("id_produto")
    if not id_produto:
        return jsonify({"error": "ID do produto é obrigatório."}), 400

    # [CORRIGIDO] Só envia campos que vieram preenchidos
    params = {"id_produto": id_produto}
    for campo in ("tipo_produto", "nome_produto", "marca_produto",
                  "preco_produto", "descricao_produto", "url_imagem",
                  "modelo_produto", "situacao_produto"):
        if data.get(campo) is not None:
            params[campo] = data.get(campo)

    if len(params) <= 1:
        return jsonify({"error": "Nenhum campo para atualizar."}), 400

    resultado = executar_sp("usp_AtualizarProduto", params)
    if resultado is None:
        return jsonify({"error": "Erro ao atualizar produto."}), 500

    return jsonify({"success": True, "message": "Produto atualizado com sucesso."})


@app.route("/api/produtos/situacao", methods=["POST"])
def api_situacao_produto():
    data = request.get_json(silent=True) or {}
    id_produto = data.get("id_produto")
    situacao = data.get("situacao")

    if not id_produto or not situacao:
        return jsonify({"error": "ID do produto e situação são obrigatórios."}), 400

    resultado = executar_sp(
        "usp_AtualizarSituacaoProduto",
        {"id_produto": id_produto, "situacao_produto": situacao}
    )
    if resultado is None:
        return jsonify({"error": "Erro ao atualizar situação do produto."}), 500

    return jsonify({"success": True, "message": "Situação do produto atualizada."})


# ---------------------------------------------------------------------------
# OFERTAS
# ---------------------------------------------------------------------------
@app.route("/api/ofertas/listar", methods=["GET"])
def api_listar_ofertas():
    params = {}
    for campo in ("loja_id", "pesquisa", "tipo_produto", "situacao",
                  "preco_min", "preco_max"):
        valor = request.args.get(campo)
        if valor:
            params[campo] = valor

    resultados = executar_sp("usp_ListarOfertas", params)
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "ofertas": resultados})


@app.route("/api/ofertas/consultar/<int:id_oferta>", methods=["GET"])
def api_consultar_oferta(id_oferta):
    resultado = executar_sp("usp_ConsultarOferta", {"id_produto": id_oferta})
    if resultado is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    if len(resultado) == 0:
        return jsonify({"error": "Oferta não encontrada."}), 404
    return jsonify({"success": True, "oferta": resultado[0]})


@app.route("/api/ofertas/anunciar", methods=["POST"])
def api_anunciar_produto():
    data = request.get_json(silent=True) or {}
    id_vendedor = data.get("id_vendedor")
    id_produto = data.get("id_produto")

    if not id_vendedor or not id_produto:
        return jsonify({"error": "ID do vendedor e do produto são obrigatórios."}), 400

    params = {"id_vendedor": id_vendedor, "id_produto": id_produto}
    resultado = executar_sp("usp_AnunciarProduto", params)
    if resultado is None:
        return jsonify({"error": "Erro ao anunciar produto."}), 500

    oferta = resultado[0] if resultado else {}

    return jsonify({
        "success": True,
        "message": "Produto anunciado com sucesso.",
        "id": oferta.get("id_oferta")
    })


@app.route("/api/ofertas/atualizar", methods=["POST"])
def api_atualizar_oferta():
    data = request.get_json(silent=True) or {}
    id_vendedor = data.get("id_vendedor")
    id_produto = data.get("id_produto")

    if not id_vendedor or not id_produto:
        return jsonify({"error": "ID do vendedor e do produto são obrigatórios."}), 400

    params = {
        "id_vendedor": id_vendedor,
        "id_produto": id_produto,
        "preco_venda": data.get("preco_venda", 0),
        "estoque": data.get("estoque", 0),
        "preco_promocional": data.get("preco_promocional", 0),
        "validade_promocao": data.get("validade_promocao"),
        "limpar_promocao": data.get("limpar_promocao", 0),
        "situacao_anuncio": data.get("situacao_anuncio", "ativo")
    }

    resultado = executar_sp("usp_AtualizarOferta", params)
    if resultado is None:
        return jsonify({"error": "Erro ao atualizar oferta."}), 500

    return jsonify({"success": True, "message": "Oferta atualizada com sucesso."})


# ---------------------------------------------------------------------------
# PEDIDOS
# ---------------------------------------------------------------------------
@app.route("/api/pedidos/realizar", methods=["POST"])
def api_realizar_pedido():
    data = request.get_json(silent=True) or {}
    id_cliente = data.get("id_cliente")
    id_vendedor = data.get("id_vendedor")
    id_produto = data.get("id_produto")
    quantidade = data.get("quantidade")
    comissao = data.get("comissao")

    if not all([id_cliente, id_vendedor, id_produto, quantidade]):
        return jsonify({"error": "ID do cliente, vendedor, produto e quantidade são obrigatórios."}), 400

    params = {
        "id_cliente": id_cliente, "id_vendedor": id_vendedor,
        "id_produto": id_produto, "quantidade": quantidade, "comissao": comissao
    }

    resultado = executar_sp("usp_RealizarPedido", params)
    if resultado is None:
        return jsonify({"error": "Erro ao realizar pedido."}), 500

    pedido = resultado[0] if resultado else {}

    return jsonify({
        "success": True,
        "message": "Pedido realizado com sucesso.",
        "id": pedido.get("id_novo_pedido")
    })


@app.route("/api/pedidos/cliente/listar", methods=["GET"])
def api_listar_pedidos_cliente():
    id_cliente = request.args.get("id_cliente")
    if not id_cliente:
        return jsonify({"error": "ID do cliente é obrigatório."}), 400

    resultados = executar_sp("usp_ListarPedidosDoCliente", {"id_cliente": id_cliente})
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "pedidos": resultados})


@app.route("/api/pedidos/loja/listar", methods=["GET"])
def api_listar_pedidos_loja():
    id_vendedor = request.args.get("id_vendedor")
    situacao = request.args.get("situacao")

    if not id_vendedor:
        return jsonify({"error": "ID do vendedor é obrigatório."}), 400

    params = {"id_vendedor": id_vendedor}
    if situacao:
        params["situacao_pedido"] = situacao

    resultados = executar_sp("usp_ListarPedidosDaLoja", params)
    if resultados is None:
        return jsonify({"error": "Erro de conexão com o banco."}), 500
    return jsonify({"success": True, "pedidos": resultados})


@app.route("/api/pedidos/situacao", methods=["POST"])
def api_atualizar_situacao_pedido():
    data = request.get_json(silent=True) or {}
    id_pedido = data.get("id_pedido")
    situacao = data.get("situacao")

    if not id_pedido or not situacao:
        return jsonify({"error": "ID do pedido e situação são obrigatórios."}), 400

    params = {"id_pedido": id_pedido, "situacao_pedido": situacao}
    resultado = executar_sp("usp_AtualizarSituacaoPedido", params)
    if resultado is None:
        return jsonify({"error": "Erro ao atualizar situação do pedido."}), 500

    return jsonify({"success": True, "message": "Situação do pedido atualizada."})


# ---------------------------------------------------------------------------
# HEALTH CHECK [NOVO]
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def api_health():
    """Rota para testar rapidamente se o banco está conectado."""
    try:
        conn = obter_conexao()
        if conn is None:
            return jsonify({"status": "erro", "db": "sem conexão"}), 500
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        conn.close()
        return jsonify({"status": "ok", "db": "conectado"})
    except Exception as e:
        return jsonify({"status": "erro", "detalhe": str(e)}), 500


if __name__ == "__main__":
    print("=" * 50)
    print("Sistema de E-commerce - Central de Ar")
    print("=" * 50)

    conn = conectar_banco()
    if conn:
        print("Banco 'CentralDeAr' conectado com sucesso!")
        conn.close()
    else:
        print("Atenção: Não foi possível conectar ao banco de dados.")
        print("Verifique as configurações no database/teste.env")

    print("\nServidor rodando em: http://0.0.0.0:5000/")
    print("Acesse: http://localhost:5000/")
    print("Health check: http://localhost:5000/api/health")
    print("=" * 50)

    app.run(host="0.0.0.0", port=5000, debug=True)  # [CORRIGIDO] debug=True em dev
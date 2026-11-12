"""Conexão com o banco de dados."""
from .config import obter_string_conexao
import pyodbc

def conectar_banco():
    """
    Estabelece conexão com o banco de dados.
    Retorna a conexão ou None em caso de erro.
    """
    try:
        conn = pyodbc.connect(obter_string_conexao())
        return conn
    except Exception as e:
        print(f"Erro na conexão com o banco: {e}")
        return None

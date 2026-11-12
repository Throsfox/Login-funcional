"""Configuração do banco de dados."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo teste.env
env_path = Path(__file__).parent / "teste.env"
load_dotenv(env_path, verbose=True)


def obter_string_conexao():
    """Retorna a string de conexão com o banco de dados."""
    server = os.getenv("DB_SERVER", r"localhost\SQLEXPRESS")
    database = os.getenv("DB_NAME", "CentralDeAr")
    driver = os.getenv("DB_DRIVER", "ODBC Driver 18 for SQL Server")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD", "")
    encrypt = os.getenv("DB_ENCRYPT", "yes")
    trust_server_cert = os.getenv("DB_TRUST_SERVER_CERTIFICATE", "yes")
    trusted = os.getenv("DB_TRUSTED_CONNECTION", "no")

    # [CORRIGIDO] DATABASE entre chaves para suportar nome com espaço
    # [CORRIGIDO] Remove acento/caracteres problemáticos no server (vírgula é OK)
    conn_str = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={{{database}}};"
        f"Encrypt={encrypt};"
        f"TrustServerCertificate={trust_server_cert};"
    )

    # [CORRIGIDO] Escolhe autenticação: Windows (Trusted) ou SQL (UID/PWD)
    if trusted and trusted.lower() in ("yes", "true", "1"):
        conn_str += "Trusted_Connection=yes;"
    else:
        conn_str += f"UID={user};PWD={password};"

    return conn_str
"""Configuração do banco de dados."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo teste.env
env_path = Path(__file__).parent / "teste.env"
load_dotenv(env_path, verbose=True)

def obter_string_conexao():
    """Retorna a string de conexão com o banco de dados."""
    server = os.getenv("DB_SERVER", "localhost\SQLEXPRESS")
    database = os.getenv("DB_NAME", "CentralDeAr")
    driver = os.getenv("DB_DRIVER", "ODBC Driver 18 for SQL Server")
    trusted = os.getenv("DB_TRUSTED_CONNECTION", "yes")
    encrypt = os.getenv("DB_ENCRYPT", "yes")
    trust_server_cert = os.getenv("DB_TRUST_SERVER_CERTIFICATE", "yes")
    
    conn_str = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"Trusted_Connection={trusted};"
        f"Encrypt={encrypt};"
        f"TrustServerCertificate={trust_server_cert}"
    )
    return conn_str

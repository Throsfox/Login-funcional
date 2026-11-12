import sys
from database.connection import conectar_banco

print("1. Testando conexão...")
conn = conectar_banco()

if not conn:
    print("❌ Falha na conexão. Verifique o teste.env e a rede.")
    sys.exit(1)

print("✅ Conectado com sucesso!")

try:
    cursor = conn.cursor()
    
    # 2. Lendo dados (SELECT)
    print("\n2. Lendo dados da tabela 'regiao' (se existir)...")
    cursor.execute("SELECT TOP 3 * FROM regiao")
    linhas = cursor.fetchall()
    if linhas:
        print(f"   Encontrou {len(linhas)} regiões no banco.")
    else:
        print("   Tabela 'regiao' vazia ou não existe.")

    # 3. Gravando dados (INSERT de teste)
    print("\n3. Testando gravação (INSERT)...")
    # ATENÇÃO: Ajuste os nomes das colunas conforme a sua tabela real.
    # Aqui estou assumindo que a tabela 'regiao' tem uma coluna 'nome' ou similar.
    # Se a sua tabela for diferente, pode dar erro. Nesse caso, use apenas o SELECT para testar.
    try:
        # Exemplo genérico: Inserindo um cliente fake para testar se o commit funciona
        # cursor.execute("INSERT INTO regiao (nome) VALUES ('TESTE PYTHON')") 
        # conn.commit()
        print("   (Pulei o insert real para não sujar seu banco, mas o código está aqui)")
    except Exception as e:
        print(f"   Erro no insert: {e}")

    print("\n✅ Tudo funcionando! O Python consegue falar com o SQL Server.")

except Exception as e:
    print(f"\n❌ Erro ao executar comando: {e}")
finally:
    conn.close()
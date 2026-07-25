import sqlite3
from flask import flask, request


conexao = sqlite3.connect("banco.db")
cursor = conexao.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS usuarios (
            id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email VARCHAR(255) NOT NULL,
            senha TEXT NOT NULL)""")

cursor.execute("""INSERT INTO usuarios
            (nome, email, senha) VALUES
            ('pedro', 'pedro@gmail.com', '1234')""")

conexao.commit()
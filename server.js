const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializar o servidor Express
const app = express();
const port = 3000;

// Middleware para fazer parsing do corpo das requisições (necessário para POST)
app.use(cors());
app.use(bodyParser.json());

// Inicializar o banco de dados SQLite
const db = new sqlite3.Database('./meu_banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabela se não existir 
db.run(`CREATE TABLE IF NOT EXISTS usuarioPersonal (  
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL, 
  email TEXT NOT NULL,  
  password TEXT NOT NULL,
  cref TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS usuarioAluno (  
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  nomeAluno TEXT NOT NULL,  
  generoAluno TEXT NOT NULL,
  alunoNascimento DATE NOT NULL,
  alunoPeso TEXT NOT NULL,
  alunoAltura TEXT NOT NULL,
  alunoLogin TEXT NOT NULL,
  alunoSenha TEXT NOT NULL
)`);


// Criar uma rota POST para o login do personal trainer
app.post('/usuarioPersonal', (req, res) => {

  const { nome, email, password, cref } = req.body;

  const sql = `INSERT INTO usuarioPersonal (nome, email, password, cref) VALUES (?, ?, ?, ?)`;
  db.run(sql, [nome, email, password, cref], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.json({ id: this.lastID }); // Retorna o ID do novo registro  
  });
});

// Criar uma rota POST para o login do aluno
app.post('/usuarioAluno', (req, res) => {

  const { nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha } = req.body;

  const sql = `INSERT INTO usuarioAluno (nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.json({ id: this.lastID }); // Retorna o ID do novo registro  
  });
});



// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
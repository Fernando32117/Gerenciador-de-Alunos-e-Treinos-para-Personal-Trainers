const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializar o banco de dados SQLite
const db = new sqlite3.Database('./meu_banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Inicializar o servidor Express
const app = express();
const port = 3000;
// Middleware para fazer parsing do corpo das requisições (necessário para POST)
app.use(cors());
app.use(bodyParser.json());



// Criar tabela se não existir usuarioPersonal
db.run(`CREATE TABLE IF NOT EXISTS usuarioPersonal (  
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nomePersonal TEXT NOT NULL, 
  emailPersonal TEXT NOT NULL UNIQUE,  
  passwordPersonal TEXT NOT NULL,
  cref TEXT NOT NULL
)`);

// Criar tabela se não existir usuarioAluno
db.run(`CREATE TABLE IF NOT EXISTS usuarioAluno (  
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  nomeAluno TEXT NOT NULL,  
  generoAluno TEXT NOT NULL,
  alunoNascimento DATE NOT NULL,
  alunoPeso TEXT NOT NULL,
  alunoAltura TEXT NOT NULL,
  alunoLogin TEXT NOT NULL UNIQUE,
  alunoSenha TEXT NOT NULL
)`);

// Criar tabela de treinos se não existir 
db.run(`CREATE TABLE IF NOT EXISTS treinoAluno ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  alunoId INTEGER NOT NULL, 
  grupoMuscular TEXT NOT NULL, 
  series INTEGER NOT NULL, 
  repeticoes INTEGER NOT NULL, 
  observacoes TEXT, 
  gif BLOB, 
  FOREIGN KEY (alunoId) REFERENCES usuarioAluno(id) )`);


// Rota para cadastro do personal trainer
app.post('/usuarioPersonal', (req, res) => {
  const { nomePersonal, emailPersonal, passwordPersonal, cref } = req.body;

  // Verificar se o e-mail já existe
  const checkEmailSql = `SELECT * FROM usuarioPersonal WHERE emailPersonal = ?`;
  db.get(checkEmailSql, [emailPersonal], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      // E-mail já existe
      return res.status(400).json({ message: 'e-mail já cadastrado' });
    } else {
      // E-mail não existe, inserir novo registro
      const insertSql = `INSERT INTO usuarioPersonal (nomePersonal, emailPersonal, passwordPersonal, cref) VALUES (?, ?, ?, ?)`;
      db.run(insertSql, [nomePersonal, emailPersonal, passwordPersonal, cref], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID }); // Retorna o ID do novo registro
      });
    }
  });
});



// Endpoint para autenticação de Personal
app.post('/loginPersonal', (req, res) => {
  const { emailPersonal, passwordPersonal } = req.body;

  db.get(`SELECT * FROM usuarioPersonal WHERE emailPersonal = ? AND passwordPersonal = ?`, [emailPersonal, passwordPersonal], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (row) {
      res.json({ id: row.id, nomePersonal: row.nomePersonal });
    } else {
      res.status(400).json({ message: 'Email ou senha incorretos' });
    }
  });
});




// Criar uma rota POST para o cadastro do aluno
app.post('/usuarioAluno', (req, res) => {
  const { nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoPassword } = req.body;

  // Verificar se o e-mail já existe
  const checkEmailSql = `SELECT * FROM usuarioAluno WHERE alunoLogin = ?`;
  db.get(checkEmailSql, [alunoLogin], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      // E-mail já existe
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    } else {
      // E-mail não existe, inserir novo registro
      const insertSql = `INSERT INTO usuarioAluno (nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.run(insertSql, [nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID }); // Retorna o ID do novo registro
      });
    }
  });
});

// Rota para autenticação do aluno
app.post('/loginAluno', (req, res) => {
  const { alunoLogin, alunoSenha } = req.body;

  const sql = `SELECT * FROM usuarioAluno WHERE alunoLogin = ? AND alunoSenha = ?`;
  db.get(sql, [alunoLogin, alunoSenha], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      // Usuário encontrado, autenticação bem-sucedida
      res.json({ message: 'Login bem-sucedido', user: row });
    } else {
      // Usuário não encontrado, autenticação falhou
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });
});

// Rota para cadastro de treino do aluno
app.post('/cadastroTreinoAluno', (req, res) => {
  const { alunoId, grupoMuscular, series, repeticoes, observacoes, gif } = req.body;

  const sql = `INSERT INTO treinoAluno (alunoId, grupoMuscular, series, repeticoes, observacoes, gif) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [alunoId, grupoMuscular, series, repeticoes, observacoes, gif], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID }); // Retorna o ID do novo registro
  });
});



// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
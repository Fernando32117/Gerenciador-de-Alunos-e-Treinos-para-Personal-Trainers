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
  personalEmail TEXT NOT NULL,  
  personalPassword TEXT NOT NULL,
  personalCref TEXT NOT NULL
)`);

// Criar uma rota POST para o login do personal trainer
app.post('/usuarioPersonal', (req, res) => {
  const { personalEmail, personalPassword, personalCref } = req.body;

  // // Verifica se todos os campos foram preenchidos
  // if (!personalEmail || !personalPassword || !personalCref) {
  //   return res.status(400).json({ error: 'Por favor, preencha todos os campos!' });
  // }

  const sql = `INSERT INTO usuarioPersonal (personalEmail, personalPassword, personalCref) VALUES (?, ?)`;  
    db.run(sql, [personalEmail, personalPassword, personalCref], function(err) {  
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

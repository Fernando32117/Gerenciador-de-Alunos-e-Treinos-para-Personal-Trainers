const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Inicializar o servidor Express
const app = express();
const port = 3000;

// Middleware para fazer parsing do corpo das requisições (necessário para POST)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar o banco de dados SQLite
let db = new sqlite3.Database('./banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar uma rota POST para o login do personal trainer
app.post('/login', (req, res) => {
  const { email, password, cref } = req.body;

  // Verifica se todos os campos foram preenchidos
  if (!email || !password || !cref) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos!' });
  }

  // Consulta o banco de dados para verificar se as credenciais estão corretas
  const query = `SELECT * FROM personal_trainers WHERE email = ? AND cref = ?`;

  db.get(query, [email, cref], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
    }

    if (!row) {
      return res.status(400).json({ error: 'Email ou CREF incorretos.' });
    }

    // Verifica a senha (nesse exemplo, a senha é armazenada como texto simples)
    if (password === row.password) {
      // Se a senha estiver correta, envia uma resposta de sucesso
      return res.json({ message: 'Login realizado com sucesso!', personal: row });
    } else {
      // Se a senha estiver incorreta, envia uma resposta de erro
      return res.status(400).json({ error: 'Senha incorreta.' });
    }
  });
});

// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

// Criar tabela se não existir treinoAluno
db.run(`CREATE TABLE IF NOT EXISTS treinoAluno ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  aluno INTEGER NOT NULL, 
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

  const checkEmailSql = `SELECT * FROM usuarioAluno WHERE alunoLogin = ?`;
  db.get(checkEmailSql, [alunoLogin], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    } else {
      const insertSql = `INSERT INTO usuarioAluno (nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.run(insertSql, [nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      });
    }
  });
});
// Rota de login do aluno
app.post('/loginAluno', (req, res) => {
  const { alunoLogin, alunoPassword } = req.body;

  const sql = `SELECT * FROM usuarioAluno WHERE alunoLogin = ? AND alunoSenha = ?`;
  db.get(sql, [alunoLogin, alunoPassword], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    res.json({ nomeAluno: row.nomeAluno });
  });
});


// Rota para cadastrar treino
app.post('/cadastrarTreino', upload.single('gif'), (req, res) => {
  const { nomeAluno, grupoMuscular, series, repeticoes, observacoes } = req.body;
  const gif = req.file ? req.file.buffer : null; // Armazena o GIF em buffer de dados binários

  // Busca o ID do aluno pelo nome
  const sqlAluno = 'SELECT id FROM usuarioAluno WHERE nomeAluno = ?';
  db.get(sqlAluno, [nomeAluno], (err, aluno) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erro ao buscar aluno." });
    }
    if (!aluno) {
      return res.status(404).json({ success: false, message: "Aluno não encontrado." });
    }

    // Insere o treino no banco com o ID do aluno
    const sqlTreino = `
      INSERT INTO treinoAluno (alunoId, grupoMuscular, series, repeticoes, observacoes, gif)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [aluno.id, grupoMuscular, series, repeticoes, observacoes, gif];

    db.run(sqlTreino, params, function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: "Erro ao cadastrar treino." });
      }
      res.json({ success: true, message: "Treino cadastrado com sucesso!" });
    });
  });
});

// Rota para buscar treinos do aluno
app.get('/treinosAluno/:aluno', (req, res) => {
  const alunoId = req.params.alunoId;

  const sql = `
    SELECT grupoMuscular, series, repeticoes, observacoes, gif 
    FROM treinoAluno 
    WHERE nomeAluno = ?
  `;

  db.all(sql, [alunoId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});





app.post('/cadastroTreinoAluno', upload.single('gif'), (req, res) => {
  const { aluno, grupoMuscular, series, repeticoes, observacoes } = req.body;
  const gif = req.file.buffer;

  // Pegue o ID do aluno do banco de dados baseado no nome (ou outra lógica que preferir)
  const alunoIdSql = `SELECT nomeAluno FROM usuarioAluno WHERE nomeAluno = ?`;
  db.get(alunoIdSql, [aluno], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ message: 'Aluno não encontrado' });
    }

    const alunoId = row.id;

    const sql = `INSERT INTO treinoAluno (alunoId, grupoMuscular, series, repeticoes, observacoes, gif) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [aluno, grupoMuscular, series, repeticoes, observacoes, gif], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID }); // Retorna o ID do novo registro
    });
  });
});















// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');

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
// Middleware para processar JSON no body das requisições
app.use(express.json());

// Servir a pasta 'css'
app.use('/css', express.static(path.join(__dirname, '../css')));
// Servir a pasta 'images'
app.use('/img', express.static(path.join(__dirname, '../img')));
// Servir a pasta 'js'
app.use('/js', express.static(path.join(__dirname, '../js')));

// Middleware para servir arquivos estáticos  
app.use(express.static(path.join(__dirname)));
// Configura o diretório para servir arquivos estáticos
app.use(express.static('pages'));

// Rota para a página inicial  
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});


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
  FOREIGN KEY (aluno) REFERENCES usuarioAluno(id) ON DELETE CASCADE
)`);

// db.serialize(() => {
//   // 1. Excluir a tabela original
//   db.run(`DROP TABLE IF EXISTS treinoAluno`, function (err) {
//     if (err) {
//       console.error("Erro ao excluir tabela treinoAluno:", err.message);
//       return;
//     }
//     console.log("Tabela treinoAluno excluída com sucesso.");

//     // 2. Recriar a tabela com ON DELETE CASCADE
//     db.run(`
//       CREATE TABLE IF NOT EXISTS treinoAluno (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         aluno INTEGER NOT NULL,
//         grupoMuscular TEXT NOT NULL,
//         series INTEGER NOT NULL,
//         repeticoes INTEGER NOT NULL,
//         observacoes TEXT,
//         gif BLOB,
//         FOREIGN KEY (aluno) REFERENCES usuarioAluno(id) ON DELETE CASCADE
//       )
//     `, function (err) {
//       if (err) {
//         console.error("Erro ao recriar tabela treinoAluno:", err.message);
//         return;
//       }
//       console.log("Tabela treinoAluno recriada com sucesso com ON DELETE CASCADE.");
//     });
//   });
// });


// Migração para corrigir a tabela treinoAluno
function atualizarTabelaTreinoAluno() {
  db.run(`ALTER TABLE treinoAluno RENAME TO treinoAluno_old`, (err) => {
    if (err) {
      console.error('Erro ao renomear a tabela antiga:', err.message);
      return;
    }
    console.log('Tabela treinoAluno renomeada para treinoAluno_old.');

    // Criar a nova tabela
    db.run(`CREATE TABLE IF NOT EXISTS treinoAluno (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      aluno INTEGER NOT NULL, 
      grupoMuscular TEXT NOT NULL, 
      series INTEGER NOT NULL, 
      repeticoes INTEGER NOT NULL, 
      observacoes TEXT, 
      gif BLOB, 
      FOREIGN KEY (aluno) REFERENCES usuarioAluno(id)
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a nova tabela treinoAluno:', err.message);
        return;
      }
      console.log('Nova tabela treinoAluno criada com sucesso.');

      // Copiar os dados para a nova tabela
      db.run(`
        INSERT INTO treinoAluno (id, aluno, grupoMuscular, series, repeticoes, observacoes, gif)
        SELECT id, aluno, grupoMuscular, series, repeticoes, observacoes, gif
        FROM treinoAluno_old
      `, (err) => {
        if (err) {
          console.error('Erro ao copiar os dados para a nova tabela:', err.message);
          return;
        }
        console.log('Dados copiados para a nova tabela treinoAluno.');
      });

      // Apagar a tabela antiga
      db.run(`DROP TABLE treinoAluno_old`, (err) => {
        if (err) {
          console.error('Erro ao apagar a tabela antiga:', err.message);
          return;
        }
        console.log('Tabela treinoAluno_old apagada com sucesso.');
      });
    });
  });
};
// // Iniciar a migração (chame manualmente quando necessário)
// atualizarTabelaTreinoAluno();



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
// Rota para autenticação de Personal
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
// Rota para exclusão de Personal
app.post('/deletePersonal', (req, res) => {
  const { emailPersonal } = req.body;
  db.run(`DELETE FROM usuarioPersonal WHERE emailPersonal = ?`, [emailPersonal], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Conta excluída com sucesso!' });
  });
});
// Rota para editar cadastro Personal
app.put('/usuarioPersonal/:id', (req, res) => {
  const { id } = req.params;
  const { nomePersonal, emailPersonal, passwordPersonal, cref } = req.body;

  const sql = `UPDATE usuarioPersonal SET nomePersonal = ?, emailPersonal = ?, passwordPersonal = ?, cref = ? WHERE id = ?`;

  db.run(sql, [nomePersonal, emailPersonal, passwordPersonal, cref, id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Informações atualizadas com sucesso', changes: this.changes });
  });
});



// Rota para cadastro do Treino do Aluno
app.post('/cadastrar-treino', upload.array('exercicios[][gif]'), (req, res) => {
  try {
    // Capturar dados do aluno e do grupo muscular
    const { aluno, grupoMuscular } = req.body;

    if (!aluno || !grupoMuscular || !req.files) {
      console.error('Dados incompletos recebidos:', req.body, req.files);
      return res.status(400).send('Dados incompletos.');
    }

    // Parse dos exercícios enviados
    const exercicios = JSON.parse(req.body.exercicios);

    if (!exercicios || !Array.isArray(exercicios)) {
      console.error('Dados dos exercícios estão inválidos:', exercicios);
      return res.status(400).send('Dados dos exercícios inválidos.');
    }

    // Processar e salvar os dados no banco de dados
    const stmt = db.prepare(`INSERT INTO treinoAluno (aluno, grupoMuscular, series, repeticoes, observacoes, gif) VALUES (?, ?, ?, ?, ?, ?)`);

    exercicios.forEach((exercicio, index) => {
      const gifFile = req.files[index] ? req.files[index].buffer : null; // Buffer do arquivo enviado

      stmt.run(
        aluno,
        grupoMuscular,
        exercicio.series,
        exercicio.repeticoes,
        exercicio.observacoes,
        gifFile
      );
    });

    stmt.finalize();
    res.send('Treino cadastrado com sucesso.');
  } catch (err) {
    console.error('Erro ao cadastrar treino:', err);
    res.status(500).send('Erro interno ao cadastrar treino.');
  }
});

// Rota para buscar alunos pelo nome
app.get('/buscar-alunos', (req, res) => {
  const { nome } = req.query;
  console.log(`Busca recebida com nome: ${nome}`); // Log da busca

  db.all(
    `SELECT * FROM usuarioAluno WHERE nomeAluno LIKE ?`,
    [`%${nome}%`],
    (err, rows) => {
      if (err) {
        console.error('Erro na consulta ao banco:', err); // Log do erro
        return res.status(500).json({ error: err.message });
      }
      console.log('Resultados encontrados:', rows); // Log dos resultados
      res.json(rows);
    }
  );
});

// Rota para editar cadastro Aluno
app.put('/usuarioAluno/:id', (req, res) => {
  const { id } = req.params;
  const { nomeAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha } = req.body;
  console.log('Dados recebidos no servidor:', req.body);
  const sql = `UPDATE usuarioAluno SET nomeAluno = ?, alunoNascimento = ?, alunoPeso = ?, alunoAltura = ?, alunoLogin = ?, alunoSenha = ? WHERE id = ?`;

  db.run(sql, [nomeAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha, id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Informações atualizadas com sucesso', changes: this.changes });
  });
});

// Rota para obter detalhes de um aluno específico
app.get('/api/aluno/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM usuarioAluno WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ aluno: row });
  });
});

// Rota para visualizar os alunos cadastrados
app.get('/api/alunos', (req, res) => {
  db.all('SELECT * FROM usuarioAluno', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ alunos: rows });
  });
});

// Rota para excluir um aluno pelo alunoLogin (email de login)
app.delete('/api/alunos/:alunoLogin', (req, res) => {
  const alunoLogin = req.params.alunoLogin;

  // Excluir aluno (treinos serão automaticamente excluídos)
  const sql = `DELETE FROM usuarioAluno WHERE alunoLogin = ?`;

  db.run(sql, [alunoLogin], function (err) {
    if (err) {
      console.error('Erro ao excluir aluno:', err.message);
      return res.status(500).json({ error: 'Erro ao excluir aluno' });
    }

    // Verifica se o aluno foi excluído
    if (this.changes > 0) {
      res.json({ message: 'Aluno e seus treinos excluídos com sucesso' });
    } else {
      res.status(404).json({ error: 'Aluno não encontrado' });
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









// // Rota de login do aluno
// app.post('/loginAluno', (req, res) => {
//   const { alunoLogin, alunoPassword } = req.body;

//   const sql = `SELECT * FROM usuarioAluno WHERE alunoLogin = ? AND alunoSenha = ?`;
//   db.get(sql, [alunoLogin, alunoPassword], (err, row) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (!row) {
//       return res.status(400).json({ message: 'E-mail ou senha inválidos' });
//     }

//     res.json({ nomeAluno: row.nomeAluno });
//   });
// });

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

    // Retorna o ID e o nome do aluno
    res.json({
      id: row.id,
      nomeAluno: row.nomeAluno
    });
  });
});
//Rota para Buscar Treinos
app.get('/treinos/:alunoId', (req, res) => {
  const alunoId = req.params.alunoId;

  const sql = `SELECT id, grupoMuscular, series, repeticoes, observacoes, gif FROM treinoAluno WHERE aluno = ?`;
  db.all(sql, [alunoId], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar treinos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar treinos.' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum treino encontrado.' });
    }

    // Codifica o GIF como base64
    rows.forEach(treino => {
      if (treino.gif) {
        treino.gif = Buffer.from(treino.gif).toString('base64');
      }
    });

    res.json(rows); // Retorna os dados incluindo o GIF codificado em Base64
  });
});





































// Servir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rascunho.html')); // Troque 'rascunho.html' pelo nome correto do seu arquivo HTML
});


// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

db.run(`PRAGMA foreign_keys = ON`, function (err) {
  if (err) {
    console.error("Erro ao ativar suporte a FOREIGN KEYS:", err.message);
  } else {
    console.log("Suporte a FOREIGN KEYS ativado.");
  }
});



//Carga para adicionar Alunos e Personais de exemplo
// Função para verificar se uma tabela está vazia e inserir exemplos
function insertExamplesIfEmpty() {
  // Verifica e insere dados na tabela usuarioPersonal
  db.get(`SELECT COUNT(*) as count FROM usuarioPersonal`, (err, row) => {
    if (err) {
      console.error("Erro ao verificar usuarioPersonal:", err.message);
    } else if (row.count === 0) {
      db.run(`
        INSERT INTO usuarioPersonal (nomePersonal, emailPersonal, passwordPersonal, cref)
        VALUES 
        ('João da Silva', 'joao.personal@example.com', 'senha123', 'CREF12345'),
        ('Maria Pereira', 'maria.personal@example.com', 'senha456', 'CREF67890'),
        ('Ana Oliveira', 'ana.personal@example.com', 'senha789', 'CREF11223')
      `, (err) => {
        if (err) {
          console.error("Erro ao inserir exemplos em usuarioPersonal:", err.message);
        } else {
          console.log("Exemplos inseridos na tabela usuarioPersonal.");
        }
      });
    }
  });

  // Verifica e insere dados na tabela usuarioAluno
  db.get(`SELECT COUNT(*) as count FROM usuarioAluno`, (err, row) => {
    if (err) {
      console.error("Erro ao verificar usuarioAluno:", err.message);
    } else if (row.count === 0) {
      db.run(`
        INSERT INTO usuarioAluno (nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha)
        VALUES 
        ('Carlos Mendes', 'Masculino', '1990-05-20', '70kg', '1.75m', 'carlos.mendes@example.com', '12345'),
        ('Fernanda Souza', 'Feminino', '1995-07-15', '60kg', '1.65m', 'fernanda.souza@example.com', 'senha123'),
        ('Rafael Lima', 'Masculino', '1988-10-30', '80kg', '1.80m', 'rafael.lima@example.com', 'pass789')
      `, (err) => {
        if (err) {
          console.error("Erro ao inserir exemplos em usuarioAluno:", err.message);
        } else {
          console.log("Exemplos inseridos na tabela usuarioAluno.");
        }
      });
    }
  });
}

// Chamar a função para inserir exemplos
insertExamplesIfEmpty();

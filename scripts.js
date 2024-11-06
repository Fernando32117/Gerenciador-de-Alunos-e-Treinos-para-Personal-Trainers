document.getElementById("formPersonal").addEventListener("submit", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do formulário  

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cref = document.getElementById("cref").value;

  // Enviar os dados para a API  
  fetch('http://localhost:3000/usuarioPersonal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email, password, cref })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Sucesso:', data);
      alert('Usuário cadastrado com sucesso! ID: ' + data.id);
      window.location.href = "dashboardPersonal.html";
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
});

document.getElementById("formCadastroAluno").addEventListener("submit", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do formulário  

  const nomeAluno = document.getElementById("nomeAluno").value;
  const generoAluno = document.getElementById("generoAluno").value;
  const alunoNascimento = document.getElementById("alunoNascimento").value;
  const alunoPeso = document.getElementById("alunoPeso").value;
  const alunoAltura = document.getElementById("alunoAltura").value;
  const alunoLogin = document.getElementById("alunoLogin").value;
  const alunoSenha = document.getElementById("alunoSenha").value;

  // Enviar os dados para a API  
  fetch('http://localhost:3000/cadastroAluno', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoSenha})
  })
    .then(response => response.json())
    .then(data => {
      console.log('Sucesso:', data);
      alert('Aluno cadastrado com sucesso! ID: ' + data.id);
      window.location.href = "dashboardPersonal.html";
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
});



function handlePersonalLogin(event) {
  event.preventDefault();
  const personalEmail = document.getElementById("personalEmail").value;
  const personalPassword = document.getElementById("personalPassword").value;
  const personalCref = document.getElementById("personalCref").value;
  if (personalEmail && personalPassword && personalCref) {
    alert("Login realizado com sucesso !");
    window.location.href = "dashboard-personal.html";
  } else {
    alert("Por favor, preencha todos os campos!");
  }
}

function handleAlunoLogin(event) {
  event.preventDefault();

  const alunoEmail = document.getElementById("alunoEmail").value;
  const alunoPassword = document.getElementById("alunoPassword").value;

  if (alunoEmail && alunoPassword) {
    alert("Login realizado com sucesso !");
    window.location.href = "dashboard-aluno.html";
  } else {
    alert("Por favor, preencha todos os campos!");
  }
}

function handleCadastroTreino(event) {
  event.preventDefault();

  const alunoSelecionado = document.getElementById("aluno").value;
  const grupoMuscular = document.getElementById("grupo-muscular").value;
  const series = document.getElementById("series").value;
  const repeticoes = document.getElementById("repeticoes").value;
  const observacoes = document.getElementById("observacoes").value;
  const gifInput = document.getElementById("gifInput").files[0];

  if (!alunoSelecionado && grupoMuscular && series && repeticoes && observacoes && gifInput) {
    alert("Por favor, preencha todos os campos.");
  }

  // Aqui você pode implementar a lógica de salvar o treino para o aluno selecionado
  alert(`Treino cadastrado para o aluno ${alunoSelecionado}!`);
  window.location.href = "dashboard-personal.html";
}

// function buscarAluno(event) {
//   const query = event.target.value.toLowerCase();
//   const listaAlunos = document.getElementById("lista-alunos");
//   listaAlunos.innerHTML = ""; // Limpa a lista anterior

//   const alunosFiltrados = alunos.filter(aluno => aluno.nome.toLowerCase().includes(query));

//   alunosFiltrados.forEach(aluno => {
//       const item = document.createElement("div");
//       item.className = "aluno-item";
//       item.textContent = aluno.nome;
//       item.onclick = () => selecionarAluno(aluno);
//       listaAlunos.appendChild(item);
//   });

//   listaAlunos.style.display = alunosFiltrados.length ? "block" : "none";
// }

// function selecionarAluno(aluno) {
//   document.getElementById("aluno").value = aluno.nome;
//   document.getElementById("lista-alunos").style.display = "none";
// }


function showCadastroAluno() {
  window.location.href = 'cadastroAluno.html';
}

function showCadastroTreino() {
  window.location.href = 'cadastroTreino.html';
}

function voltarDashboardPersonal() {
  window.location.href = 'dashboardPersonal.html';
}

function voltarDashboardAluno() {
  window.location.href = 'dashboardAluno.html';
}

function exit() {
  window.location.href = 'index.html';
}

function treino() {
  window.location.href = 'treinos.html';
}
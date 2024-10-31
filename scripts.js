function handlePersonalLogin(event) {
  event.preventDefault();

  const email = document.getElementById("personal-email").value;
  const password = document.getElementById("personal-password").value;
  const cref = document.getElementById("personal-cref").value;

  if (email && password && cref) {
    alert("Login realizado com sucesso !");
      window.location.href = "dashboard-personal.html";
  } else {
    alert("Por favor, preencha todos os campos!");
  }
}

function handleAlunoLogin(event) {
  event.preventDefault();

  const email = document.getElementById("aluno-email").value;
  const password = document.getElementById("aluno-password").value;

  if (email && password) {
    alert("Login realizado com sucesso !");
      window.location.href = "dashboard-aluno.html";
  } else {
    alert("Por favor, preencha todos os campos!");
  }
}

function handleCadastroTreino() {
  const grupoMuscular = document.getElementById('grupo-muscular').value;
  const series = document.getElementById('series').value;
  const repeticoes = document.getElementById('repeticoes').value;
  const observacoes = document.getElementById('observacoes').value;

  if (grupoMuscular && series && repeticoes && observacoes) {
    alert('Treino cadastrado com sucesso!');

  } else {
    alert('Por favor, preencha todos os campos.');
  }
}


function showCadastroAluno() {
  window.location.href = 'cadastro-aluno.html';
}

function showCadastroTreino() {
  window.location.href = 'cadastro-treino.html';
}

function voltarDashboardPersonal() {  
    window.location.href = 'dashboard-personal.html'; 
}

function voltarDashboardAluno() {  
  window.location.href = 'dashboard-aluno.html'; 
}

function exit() {  
  window.location.href = 'index.html';
}

function treino() {  
  window.location.href = 'treinos.html';
}

function handlePersonalLogin() {
  const email = document.getElementById('personal-email').value;
  const password = document.getElementById('personal-password').value;
  const cref = document.getElementById('personal-cref').value;

  if (email && password && cref) {
    alert('Login realizado com sucesso!');
    window.location.href = 'dashboard-personal.html';
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function handleAlunoLogin() {
  const email = document.getElementById('aluno-email').value;
  const password = document.getElementById('aluno-password').value;

  if (email && password) {
    alert('Login realizado com sucesso!');
    window.location.href = 'dashboard-aluno.html';
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

function handleCadastroTreino() {
  const grupoMuscular = document.getElementById('grupo-muscular').value;
  const series = document.getElementById('series').value;
  const repeticoes = document.getElementById('repeticoes').value;
  const observacoes = document.getElementById('observacoes').value;

  if (grupoMuscular && series && repeticoes && observacoes) {
    alert('Treino cadastrado com sucesso!');
    // Aqui você pode adicionar a lógica de salvar o treino
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function voltarDashboardPersonal() {  
  // Redireciona para a página do dashboard. Você pode mudar a URL para a correta.  
  window.location.href = 'dashboard-personal.html'; 
}

function exit() {  
  // Redireciona para a página index  
  window.location.href = 'index.html';
}

function treino() {  
  // Redireciona para a página index  
  window.location.href = 'treinos.html';
}
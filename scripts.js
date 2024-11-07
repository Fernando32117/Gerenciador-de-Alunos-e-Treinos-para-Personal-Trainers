document.getElementById("formCadastroPersonal").addEventListener("submit", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do formulário  

  const nomePersonal = document.getElementById("nomePersonal").value;
  const emailPersonal = document.getElementById("emailPersonal").value;
  const passwordPersonal = document.getElementById("passwordPersonal").value;
  const cref = document.getElementById("cref").value;

  // Enviar os dados para a API  
  fetch('http://localhost:3000/usuarioPersonal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nomePersonal, emailPersonal, passwordPersonal, cref })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => { throw new Error(error.message); });
      }
      return response.json();
    })
    .then(data => {
      console.log('Sucesso:', data);
      alert('Personal cadastrado com sucesso! ID: ' + data.id);
      window.location.href = "dashboardPersonal.html";
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Usuário com ' + error.message);
    });
});


document.getElementById("formLoginPersonal").addEventListener("submit", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do formulário

  const emailPersonal = document.getElementById("emailPersonal").value;
  const passwordPersonal = document.getElementById("passwordPersonal").value;

  // Enviar os dados para a API de login
  fetch('http://localhost:3000/loginPersonal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ emailPersonal, passwordPersonal })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login bem-sucedido') {
        console.log('Sucesso:', data);
        alert('Login bem-sucedido! Bem-vindo, ' + data.user.nomePersonal);
        window.location.href = "dashboardPersonal.html";
      } else {
        alert('Erro: ' + data.message);
      }
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
  const alunoPassword = document.getElementById("alunoPassword").value;

  // Enviar os dados para a API
  fetch('http://localhost:3000/usuarioAluno', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoPassword })
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

document.getElementById("formLoginAluno").addEventListener("submit", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do formulário

  const alunoLogin = document.getElementById("alunoLogin").value;
  const alunoPassword = document.getElementById("alunoPassword").value;

  // Enviar os dados para a API de login
  fetch('http://localhost:3000/loginAluno', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ alunoLogin, alunoPassword })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login bem-sucedido') {
        console.log('Sucesso:', data);
        alert('Login bem-sucedido! Bem-vindo, ' + data.user.nomeAluno);
        window.location.href = "dashboardAluno.html";
      } else {
        alert('Erro: ' + data.message);
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
});



function handleCadastroTreino(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  const aluno = document.getElementById("aluno").value;
  const grupoMuscular = document.getElementById("grupoMuscular").value;
  const series = document.getElementById("series").value;
  const repeticoes = document.getElementById("repeticoes").value;
  const observacoes = document.getElementById("observacoes").value;
  const gifInput = document.getElementById("gifInput").files[0];

  const formData = new FormData();
  formData.append('alunoId', aluno);
  formData.append('grupoMuscular', grupoMuscular);
  formData.append('series', series);
  formData.append('repeticoes', repeticoes);
  formData.append('observacoes', observacoes);
  formData.append('gif', gifInput);

  fetch('http://localhost:3000/cadastroTreinoAluno', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log('Sucesso:', data);
      alert('Treino cadastrado com sucesso! ID: ' + data.aluno);
      window.location.href = "dashboardPersonal.html";
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}


function showCadastroPersonal() {
  window.location.href = 'cadastroPersonal.html';
}

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
window.onload = function () {
  // Função para limpar o localStorage ao fazer logout
  function logout() {
    localStorage.removeItem('nomePersonal');
    localStorage.removeItem('emailPersonal');
    localStorage.removeItem('crefPersonal');
    localStorage.removeItem('userId');
    window.location.href = "loginPersonal.html";
  }

  // Adiciona a função de logout ao botão de sair
  const exitButtons = document.querySelectorAll('button[onclick="exit()"]');
  exitButtons.forEach(button => button.addEventListener('click', logout));

  // Verifica se o formulário de login do personal está presente no DOM
  const formLoginPersonal = document.getElementById("formLoginPersonal");

  if (formLoginPersonal) {
    formLoginPersonal.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailPersonal = document.getElementById("emailPersonal").value;
      const passwordPersonal = document.getElementById("passwordPersonal").value;

      fetch('http://localhost:3000/loginPersonal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailPersonal, passwordPersonal })
      })
        .then(async response => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }
          return response.json();
        })
        .then(data => {
          alert('Login realizado com sucesso! Bem-vindo(a), ' + data.nomePersonal);

          // Armazena os dados do personal no localStorage
          localStorage.setItem('userId', data.id);
          localStorage.setItem('nomePersonal', data.nomePersonal);
          localStorage.setItem('emailPersonal', data.emailPersonal);
          localStorage.setItem('crefPersonal', data.cref);

          window.location.href = "dashboardPersonal.html";
        })
        .catch((error) => {
          alert('Erro no login: ' + error.message);
        });
    });
  }

  // Verifica se o formulário de cadastro de personal está presente no DOM
  const formCadastroPersonal = document.getElementById("formCadastroPersonal");

  if (formCadastroPersonal) {
    formCadastroPersonal.addEventListener("submit", function (e) {
      e.preventDefault();

      const nomePersonal = document.getElementById("nomePersonal").value;
      const emailPersonal = document.getElementById("emailPersonal").value;
      const passwordPersonal = document.getElementById("passwordPersonal").value;
      const cref = document.getElementById("cref").value;

      fetch('http://localhost:3000/usuarioPersonal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomePersonal, emailPersonal, passwordPersonal, cref })
      })
        .then(async response => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }
          return response.json();
        })
        .then(data => {
          alert('Personal cadastrado com sucesso! : ' + nomePersonal);

          // Armazena os dados do personal no localStorage
          localStorage.setItem('userId', data.id);
          localStorage.setItem('nomePersonal', nomePersonal);
          localStorage.setItem('emailPersonal', emailPersonal);
          localStorage.setItem('crefPersonal', cref);

          window.location.href = "dashboardPersonal.html";
        })
        .catch((error) => {
          alert('Erro no cadastro: ' + error.message);
        });
    });
  }

  // Verifica se o formulário de login do aluno está presente no DOM
  const formLoginAluno = document.getElementById("formLoginAluno");

  if (formLoginAluno) {
    formLoginAluno.addEventListener("submit", function (e) {
      e.preventDefault();

      const alunoLogin = document.getElementById("alunoLogin").value;
      const alunoPassword = document.getElementById("alunoPassword").value;

      fetch('http://localhost:3000/loginAluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alunoLogin, alunoPassword })
      })
        .then(async response => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }
          return response.json();
        })
        .then(data => {
          alert('Login realizado com sucesso! Bem-vindo(a), ' + data.nomeAluno);

          // Armazena o nome do aluno no localStorage
          localStorage.setItem('alunoId', data.id);
          localStorage.setItem('nomeAluno', data.nomeAluno);

          window.location.href = "dashboardAluno.html"; // Defina o redirecionamento para o dashboard do aluno
        })
        .catch((error) => {
          alert('Erro no login: ' + error.message);
        });
    });
  }

  // Verifica se o formulário de cadastro de aluno está presente no DOM
  const formCadastroAluno = document.getElementById("formCadastroAluno");

  if (formCadastroAluno) {
    formCadastroAluno.addEventListener("submit", function (e) {
      e.preventDefault();

      const nomeAluno = document.getElementById("nomeAluno").value;
      const generoAluno = document.getElementById("generoAluno").value;
      const alunoNascimento = document.getElementById("alunoNascimento").value;
      const alunoPeso = document.getElementById("alunoPeso").value;
      const alunoAltura = document.getElementById("alunoAltura").value;
      const alunoLogin = document.getElementById("alunoLogin").value;
      const alunoPassword = document.getElementById("alunoPassword").value;

      fetch('http://localhost:3000/usuarioAluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomeAluno, generoAluno, alunoNascimento, alunoPeso, alunoAltura, alunoLogin, alunoPassword })
      })
        .then(async response => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }
          return response.json();
        })
        .then(data => {
          alert('Aluno cadastrado com sucesso! : ' + nomeAluno);
          window.location.href = "dashboardPersonal.html";
        })
        .catch((error) => {
          alert('Erro no cadastro: ' + error.message);
        });
    });
  }

  // Exibir o nome do aluno no dashboard
  const nomeAluno = localStorage.getItem('nomeAluno');
  if (nomeAluno) {
    document.getElementById('alunoName').innerText = nomeAluno;
  }


  const elemento = document.getElementById('passwordEdit'); // Substitua pelo ID do elemento correto
  if (elemento) {
    elemento.addEventListener('input', function () {
      console.log('Input detectado!');
    });
  }

  const outroElemento = document.getElementById('senhaEditAluno');
  if (outroElemento) {
    outroElemento.addEventListener('input', function () {
      console.log('Outro input detectado!');
    });
  }




};



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
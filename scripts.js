
// window.onload = function () {
//   // Verifica se o formulário de cadastro de personal está presente no DOM
//   const formCadastroPersonal = document.getElementById("formCadastroPersonal");
  
//   if (formCadastroPersonal) {
//     formCadastroPersonal.addEventListener("submit", function (e) {
//       e.preventDefault();

//       const nomePersonal = document.getElementById("nomePersonal").value;
//       const emailPersonal = document.getElementById("emailPersonal").value;
//       const passwordPersonal = document.getElementById("passwordPersonal").value;
//       const cref = document.getElementById("cref").value;

//       fetch('http://localhost:3000/usuarioPersonal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ nomePersonal, emailPersonal, passwordPersonal, cref })
//       })
//       .then(response => {
//         if (!response.ok) {
//           return response.json().then(error => { throw new Error(error.message); });
//         }
//         return response.json();
//       })
//       .then(data => {
//         alert('Personal cadastrado com sucesso! ID: ' + data.id);
//         window.location.href = "dashboardPersonal.html";
//       })
//       .catch((error) => {
//         alert('Erro no cadastro: ' + error.message);
//       });
//     });
//   }

//   // Verifica se o formulário de login do personal está presente no DOM
//     const formLoginPersonal = document.getElementById("formLoginPersonal");
    
//     if (formLoginPersonal) {
//       formLoginPersonal.addEventListener("submit", function (e) {
//         e.preventDefault();
  
//         const emailPersonal = document.getElementById("emailPersonal").value;
//         const passwordPersonal = document.getElementById("passwordPersonal").value;
  
//         fetch('http://localhost:3000/loginPersonal', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ emailPersonal, passwordPersonal })
//         })
//         .then(response => {
//           if (!response.ok) {
//             return response.json().then(error => { throw new Error(error.message); });
//           }
//           return response.json();
//         })
//         .then(data => {
//           alert('Login realizado com sucesso! Bem-vindo(a), ' + data.nomePersonal);
  
//           // Armazena o nome do personal no localStorage
//           localStorage.setItem('nomePersonal', data.nomePersonal);
  
//           window.location.href = "dashboardPersonal.html";
//         })
//         .catch((error) => {
//           alert('Erro no login: ' + error.message);
//         });
//       });
//     }
//   };

window.onload = function () {
  // Função para limpar o localStorage ao fazer logout
  function logout() {
    localStorage.removeItem('nomePersonal');
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
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
      })
      .then(data => {
        alert('Login realizado com sucesso! Bem-vindo(a), ' + data.nomePersonal);

        // Armazena o nome do personal no localStorage
        localStorage.setItem('nomePersonal', data.nomePersonal);

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
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
      })
      .then(data => {
        alert('Personal cadastrado com sucesso! ID: ' + data.id);

        // Armazena o nome do personal no localStorage
        localStorage.setItem('nomePersonal', nomePersonal);

        window.location.href = "dashboardPersonal.html";
      })
      .catch((error) => {
        alert('Erro no cadastro: ' + error.message);
      });
    });
  }
};








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
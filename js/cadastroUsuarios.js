document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem');

    // Validação dos campos
    if (!nome || !email) {
        mensagem.style.display = 'block';
        mensagem.style.color = 'red';
        mensagem.textContent = 'Todos os campos devem ser preenchidos.';
        return;
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensagem.style.display = 'block';
        mensagem.style.color = 'red';
        mensagem.textContent = 'Por favor, insira um e-mail válido.';
        return;
    }

    try {
        // Envio da requisição para o backend Node.js
        const response = await fetch('https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/cadastrar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email })
        });

        const data = await response.json();

        // Exibir mensagem de sucesso ou erro com base na resposta
        if (response.ok) {
            mensagem.style.display = 'block';
            mensagem.style.color = 'green';
            mensagem.textContent = data.message;

            // Redirecionar para a tela de Cadastro de Tarefas após meio segundo
            setTimeout(() => {
                window.location.href = '/html/CadastroTarefas.html';
            }, 500);
            
            // Limpar o formulário após o cadastro
            document.getElementById('formCadastro').reset();
        } else {
            mensagem.style.display = 'block';
            mensagem.style.color = 'red';
            mensagem.textContent = data.message || 'Erro ao cadastrar usuário. Tente novamente.';
        }

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        mensagem.style.display = 'block';
        mensagem.style.color = 'red';
        mensagem.textContent = 'Erro ao cadastrar usuário. Verifique sua conexão e tente novamente.';
    }
});
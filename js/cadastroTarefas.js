document.addEventListener('DOMContentLoaded', async function () {
    const mensagem = document.getElementById('mensagem');
    const usuarioSelect = document.getElementById('usuario');

    // Função para carregar usuários
    async function carregarUsuarios() {
        try {
            console.log("Carregando usuários...");  // Log para ver se a função é chamada
            const response = await fetch('https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/listar_usuarios');
            if (!response.ok) {
                throw new Error(`Erro na resposta da requisição: ${response.status}`);
            }

            const usuarios = await response.json();
            console.log("Usuários recebidos:", usuarios);  // Log dos dados recebidos

            // Verifica se a resposta contém usuários
            if (usuarios.length === 0) {
                mensagem.style.display = 'block';
                mensagem.style.color = 'red';
                mensagem.textContent = 'Nenhum usuário encontrado. Cadastre um usuário primeiro.';
                return;
            }

            // Adiciona os usuários no campo de seleção
            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.nome;
                usuarioSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            mensagem.style.display = 'block';
            mensagem.style.color = 'red';
            mensagem.textContent = 'Erro ao carregar usuários. Verifique a conexão.';
        }
    }

    // Chama a função para carregar os usuários ao iniciar
    carregarUsuarios();

    // Enviar formulário
    document.getElementById('formCadastroTarefas').addEventListener('submit', async function (event) {
        event.preventDefault();

        const descricao = document.getElementById('descricao').value.trim();
        const setor = document.getElementById('setor').value.trim();
        const usuario = document.getElementById('usuario').value;
        const prioridade = document.getElementById('prioridade').value;

        // Verificação se todos os campos estão preenchidos
        if (!descricao || !setor || !usuario || !prioridade) {
            mensagem.style.display = 'block';
            mensagem.style.color = 'red';
            mensagem.textContent = 'Todos os campos devem ser preenchidos.';
            return;
        }

        try {
            const response = await fetch('https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/cadastrar_tarefa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descricao, setor, usuario, prioridade })
            });

            const data = await response.json();

            if (response.ok) {
                mensagem.style.display = 'block';
                mensagem.style.color = 'green';
                mensagem.textContent = data.message;

                // Redirecionar para a tela de Gerenciar Tarefas após meio segundo
                setTimeout(() => {
                window.location.href = '/html/GerenciarTarefas.html';
                }, 500);

                // Limpar o formulário após o cadastro
                document.getElementById('formCadastroTarefas').reset();
            } else {
                mensagem.style.display = 'block';
                mensagem.style.color = 'red';
                mensagem.textContent = data.message || 'Erro ao cadastrar tarefa. Tente novamente.';
            }
        } catch (error) {
            console.error('Erro ao cadastrar tarefa:', error);
            mensagem.style.display = 'block';
            mensagem.style.color = 'red';
            mensagem.textContent = 'Erro ao cadastrar tarefa. Verifique sua conexão e tente novamente.';
        }
    });
});
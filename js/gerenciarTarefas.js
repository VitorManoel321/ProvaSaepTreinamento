// gerenciarTarefas.js

document.addEventListener('DOMContentLoaded', carregarTarefas);

async function carregarTarefas() {
    try {
        const response = await fetch('https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/listar_tarefas');
        const tarefas = await response.json();
        
        console.log(tarefas);
        
        // Verifica se a resposta é um array
        if (!Array.isArray(tarefas)) {
            console.error('Resposta inesperada ao carregar tarefas:', tarefas);
            return;
        }

        const aFazerColuna = document.getElementById('aFazer');
        const fazendoColuna = document.getElementById('fazendo');
        const prontoColuna = document.getElementById('pronto');
        
        // Limpa apenas os cards das colunas para evitar duplicação, mas mantém os títulos
        aFazerColuna.querySelectorAll('.card').forEach(card => card.remove());
        fazendoColuna.querySelectorAll('.card').forEach(card => card.remove());
        prontoColuna.querySelectorAll('.card').forEach(card => card.remove());

        tarefas.forEach(tarefa => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p><strong>Descrição:</strong> ${tarefa.descricao}</p>
                <p><strong>Setor:</strong> ${tarefa.setor}</p>
                <p><strong>Prioridade:</strong> ${tarefa.prioridade}</p>
                <p><strong>Vinculado a:</strong> ${tarefa.usuario}</p>
                <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                <select onchange="alterarStatus(${tarefa.id}, this.value)">
                    <option value="a fazer" ${tarefa.status === 'a fazer' ? 'selected' : ''}>A Fazer</option>
                    <option value="fazendo" ${tarefa.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                    <option value="pronto" ${tarefa.status === 'pronto' ? 'selected' : ''}>Pronto</option>
                </select>
            `;

            // Define um valor padrão para o status caso seja nulo ou indefinido
            const statusValido = tarefa.status || 'a fazer'; // 'a fazer' é o status padrão

            console.log(`Adicionando tarefa ${tarefa.descricao} à coluna ${statusValido}`);

            if (statusValido === 'a fazer') {
                aFazerColuna.appendChild(card);
            } else if (statusValido === 'fazendo') {
                fazendoColuna.appendChild(card);
            } else if (statusValido === 'pronto') {
                prontoColuna.appendChild(card);
            } else {
                console.warn(`Tarefa ${tarefa.descricao} possui status inválido ou nulo: ${statusValido}`);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

function editarTarefa(id) {
    window.location.href = `/html/CadastroTarefas.html?id=${id}`;
}

async function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            const response = await fetch(`https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/excluir_tarefa/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
}

async function alterarStatus(id, novoStatus) {
    try {
        const response = await fetch(`https://studious-fiesta-q7p5jpx656qqfv47-3000.app.github.dev/alterar_status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });
        const data = await response.json();
        alert(data.message);
        carregarTarefas();
    } catch (error) {
        console.error('Erro ao alterar status:', error);
    }
}
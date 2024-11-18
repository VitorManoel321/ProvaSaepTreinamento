const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurações do banco de dados
const db = mysql2.createConnection({
  host: 'localhost', // substitua pelo host do seu banco de dados MySQL
  user: 'root', // substitua pelo seu usuário do MySQL
  password: '7777', // substitua pela sua senha do MySQL
  database: 'teste' // nome do banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL');
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota para cadastrar um novo usuário
app.post('/cadastrar_usuario', (req, res) => {
  const { nome, email } = req.body;
  
  if (!nome || !email) {
    return res.status(400).json({ message: 'Todos os campos devem ser preenchidos.' });
  }

  const sql = 'INSERT INTO USUARIOS (nome, email) VALUES (?, ?)';
  db.query(sql, [nome, email], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
    res.status(200).json({ message: 'Cadastro concluído com sucesso!' });
  });
});

// Adicionar rota para listar usuários
app.get('/listar_usuarios', (req, res) => {
  const sql = 'SELECT id, nome FROM USUARIOS';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ message: 'Erro ao carregar usuários.' });
    }
    res.status(200).json(results);
  });
});

// Rota para cadastrar uma nova tarefa
app.post('/cadastrar_tarefa', (req, res) => {
  const { descricao, setor, usuario, prioridade } = req.body;
  
  if (!descricao || !setor || !usuario || !prioridade) {
    return res.status(400).json({ message: 'Todos os campos devem ser preenchidos.' });
  }

  const sql = 'INSERT INTO TAREFAS (DESCRICAO_TAREFA, NOME_SETOR, FK_USUARIO_ID, PRIORIDADE) VALUES (?, ?, ?, ?)';
  db.query(sql, [descricao, setor, usuario, prioridade], (err, result) => {
    if (err) {
      console.error('Erro ao inserir tarefa:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar tarefa.' });
    }
    res.status(200).json({ message: 'Cadastro concluído com sucesso!' });
  });
});

app.get('/listar_tarefas', (req, res) => {
  const sql = `
      SELECT 
          ID AS id, 
          DESCRICAO_TAREFA AS descricao, 
          NOME_SETOR AS setor, 
          PRIORIDADE AS prioridade, 
          STATUS_TAREFA AS status, 
          FK_USUARIO_ID AS usuario 
      FROM TAREFAS
  `;
  
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Erro ao buscar tarefas:', err);
          return res.status(500).json({ message: 'Erro ao carregar tarefas.' });
      }
      res.status(200).json(results); 
  });
});


// Rota para alterar o status de uma tarefa
app.put('/alterar_status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE TAREFAS SET STATUS_TAREFA = ? WHERE ID = ?';
  db.query(sql, [status, id], (err, result) => {
      if (err) {
          console.error('Erro ao alterar status da tarefa:', err);
          return res.status(500).json({ message: 'Erro ao alterar status da tarefa.' });
      }
      res.status(200).json({ message: 'Status atualizado com sucesso!' });
  });
});

// Rota para excluir uma tarefa
app.delete('/excluir_tarefa/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM TAREFAS WHERE ID = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Erro ao excluir tarefa:', err);
          return res.status(500).json({ message: 'Erro ao excluir tarefa.' });
      }
      res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
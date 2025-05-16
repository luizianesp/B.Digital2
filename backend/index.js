// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Criar pasta do banco de dados se não existir
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Caminho para o banco de dados
const dbPath = path.join(__dirname, 'database/database.sqlite');

// Criar banco de dados e tabelas se não existirem
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  
  console.log('Conectado ao banco de dados SQLite');
  
  // Executar script SQL de criação das tabelas
  const schemaPath = path.join(__dirname, 'database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Erro ao criar tabelas:', err.message);
    } else {
      console.log('Tabelas criadas com sucesso');
    }
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Bem-vindo à API do B.Digital", 
    endpoints: {
      getAllBooks: "GET /books",
      getBookById: "GET /books/:id",
      createBook: "POST /books",
      updateBook: "PUT /books/:id",
      deleteBook: "DELETE /books/:id"
    }
  });
});

// Rotas CRUD para livros
// GET /books - Listar todos os livros
app.get('/books', async (req, res) => {
  try {
    const books = await Book.getAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livros", error: error.message });
  }
});

// GET /books/:id - Obter um livro específico pelo ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livro", error: error.message });
  }
});

// POST /books - Criar um novo livro
app.post('/books', async (req, res) => {
  const { title, author, year, genre, description, cover } = req.body;
  
  // Validação básica
  if (!title || !author) {
    return res.status(400).json({ message: "Título e autor são obrigatórios" });
  }
  
  try {
    const newBook = await Book.create({ title, author, year, genre, description, cover });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar livro", error: error.message });
  }
});

// PUT /books/:id - Atualizar um livro existente
app.put('/books/:id', async (req, res) => {
  const { title, author, year, genre, description, cover } = req.body;
  const id = req.params.id;
  
  // Validação básica
  if (!title || !author) {
    return res.status(400).json({ message: "Título e autor são obrigatórios" });
  }
  
  try {
    const updatedBook = await Book.update(id, { title, author, year, genre, description, cover });
    res.status(200).json(updatedBook);
  } catch (error) {
    if (error.message === 'Livro não encontrado') {
      return res.status(404).json({ message: "Livro não encontrado" });
    }
    res.status(500).json({ message: "Erro ao atualizar livro", error: error.message });
  }
});

// DELETE /books/:id - Remover um livro pelo ID
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.delete(req.params.id);
    res.status(200).json({ message: "Livro removido com sucesso" });
  } catch (error) {
    if (error.message === 'Livro não encontrado') {
      return res.status(404).json({ message: "Livro não encontrado" });
    }
    res.status(500).json({ message: "Erro ao remover livro", error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
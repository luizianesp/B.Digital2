
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../database/database.sqlite');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

class Book {
  // Obter todos os livros
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM books';
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Obter um livro pelo ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM books WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Criar um novo livro
  static create(bookData) {
    return new Promise((resolve, reject) => {
      const { title, author, year, genre, description, cover } = bookData;
      const id = uuidv4();
      
      const sql = 'INSERT INTO books (id, title, author, year, genre, description, cover) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const params = [id, title, author, year || 0, genre || 'Não categorizado', description || '', cover || ''];
      
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        // Retornar o livro criado
        resolve({
          id,
          title,
          author,
          year: year || 0,
          genre: genre || 'Não categorizado',
          description: description || '',
          cover: cover || ''
        });
      });
    });
  }

  // Atualizar um livro existente
  static update(id, bookData) {
    return new Promise((resolve, reject) => {
      const { title, author, year, genre, description, cover } = bookData;
      
      // Primeiro verificar se o livro existe
      this.getById(id).then(book => {
        if (!book) {
          reject(new Error('Livro não encontrado'));
          return;
        }
        
        const sql = 'UPDATE books SET title = ?, author = ?, year = ?, genre = ?, description = ?, cover = ? WHERE id = ?';
        const params = [title, author, year || 0, genre || 'Não categorizado', description || '', cover || '', id];
        
        db.run(sql, params, function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          // Retornar o livro atualizado
          resolve({
            id,
            title,
            author,
            year: year || 0,
            genre: genre || 'Não categorizado',
            description: description || '',
            cover: cover || ''
          });
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Remover um livro
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM books WHERE id = ?';
      
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          reject(new Error('Livro não encontrado'));
          return;
        }
        
        resolve({ message: 'Livro removido com sucesso' });
      });
    });
  }
}

module.exports = Book;
// backend/setup.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Criar pasta do banco de dados se não existir
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  console.log('Criando diretório de banco de dados...');
  fs.mkdirSync(dbDir, { recursive: true });
}

// Salvar o schema SQL se ainda não existir
const schemaPath = path.join(__dirname, 'database/schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.log('Criando arquivo de schema SQL...');
  const schema = `-- Criação da tabela de livros
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  genre TEXT,
  description TEXT,
  cover TEXT
);

-- Inserir alguns dados de exemplo
INSERT INTO books (id, title, author, year, genre, description, cover)
VALUES 
  ('99e92b24-17d6-4f38-b0fe-8256246f76d6', 'Dom Casmurro', 'Machado de Assis', 1899, 'Romance', 'Um clássico da literatura brasileira que narra a história de Bentinho e seu ciúme por Capitu.', ''),
  ('5ddedcee-a021-4aa1-b9f7-be4d23510d25', 'O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 'Fantasia', 'Uma saga épica em um mundo de fantasia onde anões, elfos e humanos lutam contra o mal.', 'https://m.media-amazon.com/images/I/71ZLavBjpRL._SY466_.jpg');`;
  
  fs.writeFileSync(schemaPath, schema);
}

// Caminho para o banco de dados
const dbPath = path.join(__dirname, 'database/database.sqlite');

// Criar banco de dados e tabelas se não existirem
console.log('Configurando banco de dados...');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  
  console.log('Conectado ao banco de dados SQLite');
  
  // Executar script SQL de criação das tabelas
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Erro ao criar tabelas:', err.message);
    } else {
      console.log('Tabelas criadas com sucesso');
    }
    
    // Fechar conexão com o banco de dados
    db.close();
    console.log('Configuração concluída com sucesso!');
  });
});
-- Criação da tabela de livros
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
  ('5ddedcee-a021-4aa1-b9f7-be4d23510d25', 'O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 'Fantasia', 'Uma saga épica em um mundo de fantasia onde anões, elfos e humanos lutam contra o mal.', 'https://m.media-amazon.com/images/I/71ZLavBjpRL._SY466_.jpg');
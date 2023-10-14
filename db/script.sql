CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  login TEXT NOT NULL,
  password TEXT NOT NULL
);

INSERT OR IGNORE INTO users (username, login, password) VALUES ('patrick', 'admin', '123');

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image_url TEXT NOT NULL
);

INSERT INTO products (name, price, image_url) SELECT 'Godt Vamp (Black)', 'R$99,00', 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg' WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (Black)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg');

INSERT INTO products (name, price, image_url) SELECT 'Godt Vamp (White)', 'R$99,00', 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg' WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (White)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg');


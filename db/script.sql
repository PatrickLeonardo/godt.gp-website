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

INSERT OR IGNORE INTO products (name, price, image_url) VALUES ('Godt Vamp', 'R$99,00', 'https://imagizer.imageshack.com/img924/1020/wZzmXO.png');


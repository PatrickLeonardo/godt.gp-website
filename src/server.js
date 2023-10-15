const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const db = new sqlite3.Database(':memory:', (err) => {

    if (err) {
        console.error('\n[!] Error connecting to the SQLite database:', err.message);
    } else {

        console.log('\n[+] Connected to the SQLite database.');
        initializeDatabase()
            .then(() => {
                startServer();
            })
            .catch((error) => {
                console.error('[!] Error initializing the database:', error);
            });

    }

});

function initializeDatabase() {

    const sqlScript = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            login TEXT NOT NULL,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price TEXT NOT NULL,
            image_url TEXT NOT NULL
        );

        INSERT INTO users (username, login, password)
        SELECT 'admin', 'root', 'root'
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin' AND login = 'root' AND password = 'root');

        INSERT INTO products (name, price, image_url)
        SELECT 'Godt Vamp (Black)', 'R$99,00', 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg'
        WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (Black)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg');

        INSERT INTO products (name, price, image_url)
        SELECT 'Godt Vamp (White)', 'R$99,00', 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg'
        WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (White)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg');
    `;

    const sqlCommands = sqlScript.split(';').filter(command => command.trim() !== '');

    return executeSqlCommands(0, sqlCommands);

}

function executeSqlCommands(index, commands) {

    return new Promise((resolve, reject) => {
        if (index >= commands.length) {
            resolve();
            return;
        }

        db.run(commands[index], (err) => {
            if (err) {
                reject(err);
            } else {
                executeSqlCommands(index + 1, commands).then(resolve).catch(reject);
            }
        });
    });

}

function startServer() {

    app.get('/', (req, res) => {
        res.send("<h1>Server</h1>");
    });

    app.get('/get_products', (req, res) => {
        const query = `SELECT * FROM products`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error('[!] Error querying products:', err.message);
                return res.status(500).send('Internal server error.');
            }

            res.json(rows);
        });
    });

    app.post('/login', (req, res) => {

        const query = `SELECT * FROM users WHERE username = ? AND login = ? AND password = ?`;
        const params = [req.body.user, req.body.login, req.body.password];

        db.all(query, params, (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Erro interno no servidor.');
            }

            if (rows.length > 0) {
                res.status(200).send('Solicitação bem sucedida!');
            } else {
                return res.status(401).send('Login ou senha incorretos.');
            }

        });

    });

    app.post('/new_product', (req, res) => {
    
        const { name, price, image_url } = req.body;

        const query = 'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)';
        const values = [name, price, image_url];

        db.run(query, values, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro interno no servidor.');
            } else {
                res.status(200).send('Registro bem sucedido.')
            }
        });

    });

    app.listen(port, () => {
        console.log(`[+] Server running on port: ${port}\n`);
    });

}

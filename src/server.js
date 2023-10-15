const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 80;

app.use(express.json(), cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite solicitações de qualquer origem
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('[+] Connected to the SQlite database.\n');
});

const sqlScript = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, login TEXT NOT NULL, password TEXT NOT NULL); CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price TEXT NOT NULL, image_url TEXT NOT NULL); INSERT INTO users (username, login, password) SELECT 'admin', 'root', 'root' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'patrick' AND login = 'admin' AND password = '123'); INSERT INTO products (name, price, image_url) SELECT 'Godt Vamp (Black)', 'R$99,00', 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg' WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (Black)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img922/921/VX0Qk2.jpg'); INSERT INTO products (name, price, image_url) SELECT 'Godt Vamp (White)', 'R$99,00', 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg' WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Godt Vamp (White)' AND price = 'R$99,00' AND image_url = 'https://imagizer.imageshack.com/img923/8661/s0nSdb.jpg');"
const sqlCommands = sqlScript.split(';');

sqlCommands.forEach((sqlCommand) => {
    
    if (sqlCommand.trim() !== '') {
        db.run(sqlCommand, (err) => {
            if (err) console.error(err.message);
        });
    }

});

app.get('/', (req, res) => {
    res.send("<h1>Server</h1>")
})

app.get('/get_products', (req, res) => {
    
    console.log('Chegouuu!')
    const query = `SELECT * FROM products;`;

    db.all(query, (err, rows) => {

        if(err) {
            console.log(err);
            return res.status(500).send('Erro interno no servidor.');
        }
        
        console.log(rows)
        res.json(rows);
    });
});

app.post('/login', (req, res) => {
    
    const query = `SELECT * FROM users WHERE username = ? AND login = ? AND password = ?`;
    const params = [req.body.user, req.body.login, req.body.password];
    console.log(params)

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno no servidor.');
        }

        if (rows.length > 0) {
            console.log('ok')
            res.status(200).send('Solicitação bem sucedida!');
        } else {
            return res.status(401).send('Login ou senha incorretos.');
        }

    });
});

app.post('/new_account', (req, res) => {
   
    const { user, login, password } = req.body;
    console.log(user, login, password)

    const query = `INSERT INTO users (username, login, password) VALUES (?, ?, ?)`;
    const params = [user, login, password];

    db.run(query, params, function (err) {
        
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno no servidor.');
        }

        const selectQuery = 'SELECT * FROM users';
        db.all(selectQuery, (err, rows) => {
            
            if (err) {
                console.error(err);
                return res.status(500).send('Erro interno no servidor.');
            }

            return res.json(rows);
        });
    });

});

app.listen(port, () => {
    console.log("\n[+] Server running on port: " + port)
});


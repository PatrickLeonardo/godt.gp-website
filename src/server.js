const cors = require('cors');
const express = require('express');
const mysql = require('mysql2')
const app = express();
const port = 8080;

require('dotenv').config()
app.use(express.json(), cors());

const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('\n[+] Connected to PlanetScale')

connection.query('SELECT * FROM users;', (err, results) => {
    if (err) console.log(err);
    console.log(results);
})

const data = [];
var index = 0;

app.get('/', (req, res) => {
    return "<h1>Server</h1>"
})

app.post('/login', (req, res) => {

    const query = 'SELECT * FROM users WHERE user = "' + req.body.user +  '" && login = "' + req.body.login + '" && password = "' + req.body.password + '";'

    connection.query(query, (err, results) =>{
        
        if (err) {

            console.log(err);
            alert('Login ou senha incorretos.');
            
        } else {
            console.log(results)
            return res.redirect('http://127.0.0.1:5500/index.html');
        }
    
    });
    
})

app.post('/new_account', (req, res) => {
    data.push(req.body)
    
    console.log(req.body);
 
    const query = 'INSERT INTO users (user, login, password) VALUES ("' + data[index].user + '", "' + data[index].login + '", "' + data[index].password + '"' + ');'

    connection.query(query, (err, results) => {
        if (err) console.log(err);
        console.log(results);
    })

    connection.query('SELECT * FROM users;', (err, results) => {
        if (err) console.log(err);
        console.log(results);
    })

    index ++;

    return res.json(data)
    
});

app.listen(port, () => {
    console.log("[+] Server running on port: " + port + "\n")
});

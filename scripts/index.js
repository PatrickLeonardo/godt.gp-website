require('dotenv').config()
const mysql = require('mysql2')

const connection = mysql.createConnection(process.env.DATABASE_URL)

if (connection) {
    console.log('Connected to PlanetScale!')

    connection.query('SHOW TABLES', (err, results) => {
        if (err) console.log(err);
        console.log(results);
    });
    
    connection.end()
}

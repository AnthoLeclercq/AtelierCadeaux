require('dotenv').config();
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((error) => {

    if (error) {
        console.error('erreur de connection ', error)
    }
    else {
        console.log('Bien connecté')
    }
})

module.exports = db;
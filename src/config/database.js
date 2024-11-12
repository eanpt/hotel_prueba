const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || '34.31.89.249',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234567890',
    database: process.env.DB_NAME || 'hotel_test'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL');
});

module.exports = db;
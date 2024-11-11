// Importar las dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Crear una instancia de la aplicación Express
const app = express();

// Configuración para poder recibir datos de formularios (POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Cambia esto por tu usuario de MySQL
    password: 'root',       // Cambia esto por tu contraseña de MySQL
    database: 'hotel'   // Asegúrate de tener una base de datos llamada 'hotel'
});

// Verificar si la conexión a la base de datos es exitosa
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Servir los archivos estáticos (HTML, CSS)
app.use(express.static('public'));

// Endpoint para manejar la reserva
app.post('/reservar', (req, res) => {
    const { numeroHabitacion, fechaInicio, fechaFin } = req.body;

    if (!numeroHabitacion || !fechaInicio || !fechaFin) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // SQL para insertar los datos de la reserva en la base de datos
    const query = 'INSERT INTO reservas (numeroHabitacion, fechaInicio, fechaFin) VALUES (?, ?, ?)';
    
    db.query(query, [numeroHabitacion, fechaInicio, fechaFin], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err.stack);
            return res.status(500).send('Error al procesar la reserva');
        }
        res.status(200).send('Reserva realizada con éxito');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en funcionamiento en http://localhost:3000');
});

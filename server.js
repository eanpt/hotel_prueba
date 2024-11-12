require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Inicialización de Express
const app = express();

// Configuración del middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Importar y usar rutas
const routes = require('./src/routes');
app.use('/', routes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
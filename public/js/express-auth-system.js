// server.js
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const crypto = require('crypto');
const app = express();

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false
}));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_register_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    next();
};

// Rutas
app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/bienvenida.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/auth/login', (req, res) => {
    const { correo, password } = req.body;
    const hashedPassword = crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');

    const query = 'SELECT * FROM usuarios WHERE email = ? AND clave = ?';
    
    db.query(query, [correo, hashedPassword], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ 
                success: false, 
                message: 'Error en el servidor' 
            });
        }

        if (results.length > 0) {
            req.session.usuario = correo;
            res.json({ 
                success: true, 
                redirect: '/bienvenida' 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Usuario no existe, por favor verifique los datos introducidos' 
            });
        }
    });
});

app.post('/auth/registro', (req, res) => {
    const { nombre_completo, correo, cedula, password } = req.body;
    const hashedPassword = crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');

    // Verificar correo duplicado
    db.query('SELECT * FROM usuarios WHERE email = ?', [correo], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ 
                success: false, 
                message: 'Error en el servidor' 
            });
        }

        if (results.length > 0) {
            return res.json({ 
                success: false, 
                message: 'Este correo ya está registrado' 
            });
        }

        // Verificar cédula duplicada
        db.query('SELECT * FROM usuarios WHERE idd = ?', [cedula], (err, results) => {
            if (err) {
                console.error(err);
                return res.json({ 
                    success: false, 
                    message: 'Error en el servidor' 
                });
            }

            if (results.length > 0) {
                return res.json({ 
                    success: false, 
                    message: 'Este documento ya está registrado' 
                });
            }

            // Insertar nuevo usuario
            const query = 'INSERT INTO usuarios (full_name, email, idd, clave) VALUES (?, ?, ?, ?)';
            db.query(query, [nombre_completo, correo, cedula, hashedPassword], (err) => {
                if (err) {
                    console.error(err);
                    return res.json({ 
                        success: false, 
                        message: 'Error al crear el usuario' 
                    });
                }

                res.json({ 
                    success: true, 
                    message: 'Usuario creado exitosamente' 
                });
            });
        });
    });
});

app.get('/bienvenida', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bienvenida.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

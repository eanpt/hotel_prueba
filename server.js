// Importación de módulos requeridos
require('dotenv').config(); // Para variables de entorno
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const crypto = require('crypto');

// Inicialización de la aplicación Express
const app = express();

// Configuración de middleware
app.use(express.json()); // Para poder procesar JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para poder procesar datos de formularios
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

// Configuración de las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Solo usar HTTPS en producción
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'login_register_db'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL');
});

// Middleware para verificar si el usuario está autenticado
const requireAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    next();
};

// Rutas

// Ruta principal
app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/bienvenida');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de login
app.post('/auth/login', (req, res) => {
    const { correo, password } = req.body;
    
    // Encriptar la contraseña con SHA-512
    const hashedPassword = crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');

    // Consulta a la base de datos
    const query = 'SELECT * FROM usuarios WHERE email = ? AND clave = ?';
    
    db.query(query, [correo, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.json({ 
                success: false, 
                message: 'Error en el servidor' 
            });
        }

        if (results.length > 0) {
            // Usuario encontrado
            req.session.usuario = correo;
            res.json({ 
                success: true, 
                redirect: '/bienvenida' 
            });
        } else {
            // Usuario no encontrado
            res.json({ 
                success: false, 
                message: 'Usuario no existe, por favor verifique los datos introducidos' 
            });
        }
    });
});

// Ruta de registro
app.post('/auth/registro', (req, res) => {
    const { nombre_completo, correo, cedula, password } = req.body;
    
    // Encriptar la contraseña
    const hashedPassword = crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');

    // Verificar si el correo ya existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error verificando correo:', err);
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

        // Verificar si la cédula ya existe
        db.query('SELECT * FROM usuarios WHERE idd = ?', [cedula], (err, results) => {
            if (err) {
                console.error('Error verificando cédula:', err);
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

            // Si no hay duplicados, insertar el nuevo usuario
            const insertQuery = 'INSERT INTO usuarios (full_name, email, idd, clave) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [nombre_completo, correo, cedula, hashedPassword], (err) => {
                if (err) {
                    console.error('Error en registro:', err);
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

// Ruta de bienvenida (protegida)
app.get('/bienvenida', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bienvenida.html'));
});

// Ruta de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

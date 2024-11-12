const db = require('../config/database');
const crypto = require('crypto');

const login = (req, res) => {
    const { correo, password } = req.body;

    // Encriptar contraseña
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
            // Usuario encontrado - crear sesión
            req.session.usuario = correo;
            req.session.userId = results[0].id;

            res.json({
                success: true,
                redirect: '/bienvenida'
            });
        } else {
            // Usuario no encontrado
            res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
    });
};

const register = (req, res) => {
    const { nombre_completo, correo, cedula, password } = req.body;

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
                    message: 'Esta cédula ya está registrada'
                });
            }

            // Encriptar contraseña
            const hashedPassword = crypto
                .createHash('sha512')
                .update(password)
                .digest('hex');

            // Insertar nuevo usuario
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
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    login,
    register,
    logout
};
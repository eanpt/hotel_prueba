const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');

// Middleware de autenticación simplificado
const checkAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    next();
};

// Rutas públicas
router.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/bienvenida');
    }
    res.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

// Rutas protegidas
router.get('/bienvenida', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/bienvenida.html'));
});

router.get('/promociones', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/promociones.html'));
});

router.get('/reservas-bogota', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/reservasBgta.html'));
});

router.get('/reservas-cali', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/reservasCali.html'));
});

router.get('/reservas-medellin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/reservasMedellin.html'));
});

// Rutas de autenticación
router.post('/auth/login', authController.login);
router.post('/auth/registro', authController.register);
router.get('/auth/logout', authController.logout);

module.exports = router;
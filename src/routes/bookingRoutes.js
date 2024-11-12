const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Rutas para reservas
router.get('/', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingDetails);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.cancelBooking);

// Rutas para verificación de disponibilidad
router.get('/availability/:hotelId', bookingController.checkAvailability);

module.exports = router;
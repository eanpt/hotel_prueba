const db = require('../config/database');

const getUserBookings = (req, res) => {
    const userId = req.session.userId;

    const query = `
        SELECT r.*, h.nombre as hotel_name 
        FROM reservas r
        JOIN hoteles h ON r.hotel_id = h.id
        WHERE r.user_id = ?
    `;

    db.query(query, [userId], (err, bookings) => {
        if (err) {
            console.error('Error obteniendo reservas:', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las reservas'
            });
        }

        res.json({
            success: true,
            bookings
        });
    });
};

const createBooking = (req, res) => {
    const { hotel_id, room_number, check_in_date, check_out_date } = req.body;
    const userId = req.session.userId;

    // Verificar disponibilidad primero
    const checkQuery = `
        SELECT COUNT(*) as count 
        FROM reservas 
        WHERE hotel_id = ? 
        AND room_number = ?
        AND status != 'CANCELLED'
        AND ((check_in_date <= ? AND check_out_date >= ?) 
        OR (check_in_date <= ? AND check_out_date >= ?)
        OR (check_in_date >= ? AND check_out_date <= ?))
    `;

    db.query(
        checkQuery,
        [hotel_id, room_number, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error verificando disponibilidad'
                });
            }

            if (results[0].count > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Habitación no disponible para las fechas seleccionadas'
                });
            }

            // Crear la reserva
            const insertQuery = `
                INSERT INTO reservas (user_id, hotel_id, room_number, check_in_date, check_out_date, status) 
                VALUES (?, ?, ?, ?, ?, 'CONFIRMED')
            `;

            db.query(insertQuery, [userId, hotel_id, room_number, check_in_date, check_out_date], (err, result) => {
                if (err) {
                    console.error('Error creando reserva:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error al crear la reserva'
                    });
                }

                res.json({
                    success: true,
                    message: 'Reserva creada exitosamente',
                    booking_id: result.insertId
                });
            });
        });
};

const getBookingDetails = (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    const query = `
        SELECT r.*, h.nombre as hotel_name
        FROM reservas r
        JOIN hoteles h ON r.hotel_id = h.id
        WHERE r.id = ? AND r.user_id = ?
    `;

    db.query(query, [id, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los detalles de la reserva'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        res.json({
            success: true,
            booking: results[0]
        });
    });
};

const cancelBooking = (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    const query = 'UPDATE reservas SET status = "CANCELLED" WHERE id = ? AND user_id = ?';

    db.query(query, [id, userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al cancelar la reserva'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Reserva cancelada exitosamente'
        });
    });
};

const checkAvailability = (req, res) => {
    const { hotelId } = req.params;
    const { room_number, check_in_date, check_out_date } = req.query;

    const query = `
        SELECT COUNT(*) as count 
        FROM reservas 
        WHERE hotel_id = ? 
        AND room_number = ?
        AND status != 'CANCELLED'
        AND ((check_in_date <= ? AND check_out_date >= ?) 
        OR (check_in_date <= ? AND check_out_date >= ?)
        OR (check_in_date >= ? AND check_out_date <= ?))
    `;

    db.query(
        query,
        [hotelId, room_number, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al verificar disponibilidad'
                });
            }

            res.json({
                success: true,
                available: results[0].count === 0
            });
        }
    );
};

module.exports = {
    getUserBookings,
    createBooking,
    getBookingDetails,
    cancelBooking,
    checkAvailability
};
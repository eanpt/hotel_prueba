const db = require('../config/database');

const getAllHotels = (req, res) => {
    const query = `
        SELECT h.*, 
            COUNT(DISTINCT r.room_number) as total_rooms,
            COUNT(DISTINCT CASE WHEN r.status = 'CONFIRMED' THEN r.room_number END) as occupied_rooms
        FROM hoteles h
        LEFT JOIN reservas r ON h.id = r.hotel_id AND r.status = 'CONFIRMED'
        GROUP BY h.id
    `;

    db.query(query, (err, hotels) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los hoteles'
            });
        }

        res.json({
            success: true,
            hotels
        });
    });
};

const getHotelDetails = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT h.*, 
            COUNT(DISTINCT r.room_number) as total_rooms,
            COUNT(DISTINCT CASE WHEN r.status = 'CONFIRMED' THEN r.room_number END) as occupied_rooms
        FROM hoteles h
        LEFT JOIN reservas r ON h.id = r.hotel_id AND r.status = 'CONFIRMED'
        WHERE h.id = ?
        GROUP BY h.id
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los detalles del hotel'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hotel no encontrado'
            });
        }

        res.json({
            success: true,
            hotel: results[0]
        });
    });
};

const getHotelRooms = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT DISTINCT r.room_number,
            r.room_type,
            r.price_per_night,
            CASE WHEN EXISTS (
                SELECT 1 FROM reservas res 
                WHERE res.hotel_id = r.hotel_id 
                AND res.room_number = r.room_number 
                AND res.status = 'CONFIRMED'
                AND CURDATE() BETWEEN res.check_in_date AND res.check_out_date
            ) THEN 'occupied' ELSE 'available' END as status
        FROM rooms r
        WHERE r.hotel_id = ?
    `;

    db.query(query, [id], (err, rooms) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las habitaciones'
            });
        }

        res.json({
            success: true,
            rooms
        });
    });
};

module.exports = {
    getAllHotels,
    getHotelDetails,
    getHotelRooms
};
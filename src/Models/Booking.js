class Booking {
    constructor(db) {
        this.db = db;
    }

    create(bookingData, callback) {
        const { user_id, hotel_id, room_number, check_in_date, check_out_date } = bookingData;

        this.db.query(
            'INSERT INTO reservas (user_id, hotel_id, room_number, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, ?, "ACTIVE")',
            [user_id, hotel_id, room_number, check_in_date, check_out_date],
            callback
        );
    }

    findByUserId(userId, callback) {
        this.db.query(
            'SELECT * FROM reservas WHERE user_id = ?',
            [userId],
            callback
        );
    }

    findByHotel(hotelId, callback) {
        this.db.query(
            'SELECT * FROM reservas WHERE hotel_id = ?',
            [hotelId],
            callback
        );
    }

    checkAvailability(hotelId, roomNumber, checkInDate, checkOutDate, callback) {
        this.db.query(
            `SELECT * FROM reservas 
             WHERE hotel_id = ? 
             AND room_number = ? 
             AND status = "ACTIVE"
             AND ((check_in_date BETWEEN ? AND ?) 
             OR (check_out_date BETWEEN ? AND ?))`,
            [hotelId, roomNumber, checkInDate, checkOutDate, checkInDate, checkOutDate],
            callback
        );
    }
}

module.exports = Booking;
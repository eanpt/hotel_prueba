const crypto = require('crypto');

class User {
    constructor(db) {
        this.db = db;
    }

    findByEmail(email, callback) {
        this.db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email],
            callback
        );
    }

    findById(id, callback) {
        this.db.query(
            'SELECT * FROM usuarios WHERE id = ?',
            [id],
            callback
        );
    }

    create(userData, callback) {
        const { full_name, email, idd, password } = userData;

        const hashedPassword = crypto
            .createHash('sha512')
            .update(password)
            .digest('hex');

        this.db.query(
            'INSERT INTO usuarios (full_name, email, idd, clave) VALUES (?, ?, ?, ?)',
            [full_name, email, idd, hashedPassword],
            callback
        );
    }

    validatePassword(inputPassword, storedHash) {
        const hashedInput = crypto
            .createHash('sha512')
            .update(inputPassword)
            .digest('hex');

        return hashedInput === storedHash;
    }
}

module.exports = User;
const database = require('../config/Database');
const { AppError } = require('../utils/Error');

async function create (name, email, hashPassword) {
    try {
        const query = 'INSERT INTO users (name_, email, passrd) VALUES (?, ?, ?)';
        const values = [name, email, hashPassword];
        const result = await database.execute(query, values);
        return result.insertId;
    } catch (error) {
        if (error.errno === 1062) throw new AppError('Email já cadastrado.', 409);
        throw error;
    }
};

async function checkUserId (userId) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = ?) AS userExists';
    const values = [userId];
    const result = await database.execute(query, values);
    return result[0].userExists === 1;
};

async function getUserByEmail(email) {
    const query = 'SELECT id, name_, email, passrd FROM users WHERE email = ?';
    const rows = await database.execute(query, [email]);
    return rows[0] || null;
}

async function findPasswordById(userId) {
    const query = 'SELECT passrd FROM users WHERE id = ?';
    const rows = await database.execute(query, [userId]);
    return rows[0] ? rows[0].passrd : null;
}

async function updateUser(userId, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    
    const rows = await database.execute(query, [...values, userId]);

    return rows.affectedRows > 0;
};

module.exports = { 
    create,
    checkUserId,
    getUserByEmail,
    findPasswordById,
    updateUser
};

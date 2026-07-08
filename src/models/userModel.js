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
        throw new AppError('Erro interno do servidor.', 500);
    }
};

async function checkUserId (userId) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = ?) AS userExists';
    const values = [userId];
    const result = await database.execute(query, values);
    return result[0].userExists === 1;
};

module.exports = { 
    create,
    checkUserId,
};

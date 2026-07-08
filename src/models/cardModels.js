const database = require('../config/Database');
const { AppError } = require('../utils/Error');

exports.create = async (userId, message, position, image_url, image_id) => {
    try {
        const query = 'INSERT INTO cards (user_id, position_, back_message, image_url, image_id) VALUES (?, ?, ?, ?, ?)';
        const values = [userId, position, message, image_url, image_id];
        const result = await database.execute(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Erro ao criar o card:', error);
        throw new AppError('Erro interno do servidor.', 500);
    }
};
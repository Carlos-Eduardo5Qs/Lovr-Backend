const database = require('../config/Database');

const { AppError, NotFoundError } = require('../utils/Error');

exports.create = async (userId, message, position, image_url, image_id) => {
    try {
        const query = 'INSERT INTO cards (user_id, position_, back_message, image_url, image_id) VALUES (?, ?, ?, ?, ?)';
        const values = [userId, position, message, image_url, image_id];
        const result = await database.execute(query, values);
        return result.insertId;
    } catch (error) {
        throw new AppError('Erro interno do servidor.', 500);
    }
};

exports.getAllcard = async (userId) => {
    try {
        const query = 'SELECT id, position_, back_message, image_url FROM cards WHERE user_id = ? ORDER BY position_ ASC';
        const rows = await database.execute(query, [userId]);

        if (rows.length === 0) throw new NotFoundError('Nenhum card foi encontrado.');

        return rows;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;

        throw new AppError('Erro interno do servidor', 500);
    }
}
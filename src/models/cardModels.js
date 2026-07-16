const database = require('../config/Database');

const { AppError, NotFoundError } = require('../utils/Error');

async function create (userId, message, position, image_url, image_id) {
    const query = 'INSERT INTO cards (user_id, position_, back_message, image_url, image_id) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, position, message, image_url, image_id];
    const result = await database.execute(query, values);
    return result.insertId;
};

async function getAllcard (userId) {
    const query = 'SELECT id, position_, back_message, image_url FROM cards WHERE user_id = ? ORDER BY position_ ASC';
    const rows = await database.execute(query, [userId]);

    if (rows.length === 0) throw new NotFoundError('Nenhum card foi encontrado.');

    return rows;
}

async function getCardByIdAndUser (cardId, userId) {
    const query = 'SELECT id, position_, back_message, image_url, image_id FROM cards WHERE id = ? AND user_id = ?';
    const values = [cardId, userId];
    const result = await database.execute(query, values)
    return result[0] || null;
};

async function updateDynamic(cardId, fieldsToUpdate) {
    const keys = Object.keys(fieldsToUpdate);
    
    if (keys.length === 0) return;

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const values = [...Object.values(fieldsToUpdate), cardId];

    const query = `UPDATE cards SET ${setClause} WHERE id = ?`;
    
    await database.execute(query, values);
}

module.exports = {
    create,
    getAllcard,
    getCardByIdAndUser,
    updateDynamic
}
const database = require('../config/Database');
const { AppError, NotFoundError } = require('../utils/Error');

async function create (dashboard_id, message, position, image_url, image_id) {
    const query = 'INSERT INTO cards (dashboard_id, position_, back_message, image_url, image_id) VALUES (?, ?, ?, ?, ?)';
    const values = [dashboard_id, position, message, image_url, image_id];
    const result = await database.execute(query, values);
    return result.insertId;
};

async function getAllcard (dashboard_id) {
    const query = 'SELECT id, position_, back_message, image_url FROM cards WHERE dashboard_id = ? ORDER BY position_ ASC';
    const rows = await database.execute(query, [dashboard_id]);

    if (rows.length === 0) throw new NotFoundError('Nenhum card foi encontrado.');

    return rows;
}

async function getCardByIdAndDashboard (cardId, dashboard_id) {
    const query = 'SELECT id, position_, back_message, image_url, image_id FROM cards WHERE id = ? AND dashboard_id = ?';
    const values = [cardId, dashboard_id];
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

async function deleteCardById (cardId) {
    const query = 'DELETE FROM cards WHERE id = ?';
    await database.execute(query, [cardId]);
}

module.exports = {
    create,
    getAllcard,
    getCardByIdAndDashboard,
    updateDynamic,
    deleteCardById
};
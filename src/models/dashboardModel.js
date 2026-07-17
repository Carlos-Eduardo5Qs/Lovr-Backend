const database = require('../config/Database');
const { AppError, NotFoundError } = require('../utils/Error');

async function checkDashboardOwnership (dashboardId, userId) {
    const query = 'SELECT EXISTS(SELECT 1 FROM dashboard WHERE id = ? AND user_id = ?) AS isOwner';
    const values = [dashboardId, userId]
    const result = await database.execute(query, values);
    
    return result[0].isOwner === 1;
};

async function createDashboard (userId, dashboardData) {
    const { 
        title, 
        subtitle, 
        terminal_user, 
        terminal_host, 
        terminal_welcome_msg 
    } = dashboardData;

    const query = `
        INSERT INTO dashboard 
        (user_id, title, subtitle, terminal_user, terminal_host, terminal_welcome_msg) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        userId, 
        title || 'Feliz Aniversário!', 
        subtitle || 'Para minha pessoa favorita!', 
        terminal_user || 'user', 
        terminal_host || 'linux', 
        terminal_welcome_msg || 'Welcome to Linux'
    ];

    const result = await database.execute(query, values);
    return result.insertId;
}

async function getDashboardByUserId(dashboardId) {
    const query = 'SELECT title, subtitle, terminal_user, terminal_host, terminal_welcome_msg FROM dashboard WHERE id = ?';
    const values = [dashboardId];
    const result = await database.execute(query, values);
    return result[0] || null;
}

async function getAllDashboardByUserId (userId) {
    const query = 'SELECT * FROM dashboard WHERE user_id = ?';
    const result = await database.execute(query, [userId]);
    return result;
};

async function updateDashboard (dashboardId, data) {
    const keys = Object.keys(data);

    if (keys.length === 0) return;

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), dashboardId];
    const query = `UPDATE dashboard SET ${setClause} WHERE id = ?`;

    return await database.execute(query, values);
};

async function deleteDashboard(dashboardId) {
    const query = 'DELETE FROM dashboard WHERE id = ?';
    const result = await database.execute(query, [dashboardId]);
    return result;
};

module.exports = {
    checkDashboardOwnership,
    createDashboard,
    
    getAllDashboardByUserId,
    getDashboardByUserId,
    updateDashboard,
    deleteDashboard
};
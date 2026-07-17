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

module.exports = {
    checkDashboardOwnership,
    createDashboard
};
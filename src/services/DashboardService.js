const { NotFoundError } = require('../utils/Error');
const { checkDashboardOwnership, createDashboard, getDashboardByUserId, getAllDashboardByUserId, updateDashboard } = require('../models/dashboardModel');

const user = require('../services/UserService');
const User = require('../services/UserService');

function Dashboard () {
    this.user = new User();
}

Dashboard.prototype.verifyDashboardOwnership = async function (dashboardId, userId) {
    const isOwner = await checkDashboardOwnership(dashboardId, userId);
    if (!isOwner) throw new NotFoundError('Mural não encontrado.');
    return isOwner;
}

Dashboard.prototype.createNewDashboard = async function (userId, dashboardData) {
    if (!userId) throw new NotFoundError('Usuário não encontrado.');

    const dashboardId = await createDashboard(userId, dashboardData);

    return {
        id: dashboardId,
        ...dashboardData
    };
};

Dashboard.prototype.getUserDashboards = async function (userId) {
    const isUserIdIsValid = await this.user.isValidUserId(userId);
    const isUserExists = await this.user.userIdExists(isUserIdIsValid);

    if (!isUserExists) throw new NotFoundError('Usuário não encontrado.');

    return await getAllDashboardByUserId(userId);
};

Dashboard.prototype.updateDashboard = async function (dashboardId, userId, updateData) {
    const isUserIdIsValid = await this.user.isValidUserId(userId);
    const isUserExists = await this.user.userIdExists(isUserIdIsValid);

    if (!isUserExists) throw new NotFoundError('Usuário não encontrado.');

    const currentDashboard = await getDashboardByUserId(dashboardId, isUserIdIsValid); 
    if (!currentDashboard) throw new NotFoundError('Dashboard não encontrado.');

    await this.verifyDashboardOwnership(dashboardId, isUserIdIsValid);

    const fields = {};

    if (updateData.title) fields.title = updateData.title;
    if (updateData.subtitle) fields.subtitle = updateData.subtitle;
    if (updateData.terminal_user) fields.terminal_user = updateData.terminal_user;
    if (updateData.terminal_host) fields.terminal_host = updateData.terminal_host;
    if (updateData.terminal_welcome_msg) fields.terminal_welcome_msg = updateData.terminal_welcome_msg;

    if (Object.keys(fields).length === 0) {
        throw new ValidationError('Nenhum dado foi enviado para atualização.');
    }

    await updateDashboard(dashboardId, fields);

    return {
        id: Number(dashboardId),
        title: fields.title !== undefined ? fields.title : currentDashboard.title,
        subtitle: fields.subtitle !== undefined ? fields.subtitle : currentDashboard.subtitle,
        terminal_user: fields.terminal_user !== undefined ? fields.terminal_user : currentDashboard.terminal_user,
        terminal_host: fields.terminal_host !== undefined ? fields.terminal_host : currentDashboard.terminal_host,
        terminal_welcome_msg: fields.terminal_welcome_msg !== undefined ? fields.terminal_welcome_msg : currentDashboard.terminal_welcome_msg
    };
};

module.exports = Dashboard;
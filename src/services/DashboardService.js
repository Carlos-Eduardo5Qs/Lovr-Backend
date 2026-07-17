const { NotFoundError } = require('../utils/Error');
const { checkDashboardOwnership, createDashboard } = require('../models/dashboardModel');

function Dashboard () {}

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

module.exports = Dashboard;
const { AppError } = require('../../utils/Error');

const Dashboard = require('../../services/DashboardService');

exports.update = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const userId = req.userId;

        const { title, subtitle, terminal_user, terminal_host, terminal_welcome_msg } = req.body;

        const dashboardData = await new Dashboard().updateDashboard(dashboardId, userId, {
            title,
            subtitle,
            terminal_user,
            terminal_host,
            terminal_welcome_msg
        });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Dados atualizados',
            data: dashboardData,
            error: null
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                status: error.statusCode,
                error: error.message,
                data: null
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null
        });
    };
};
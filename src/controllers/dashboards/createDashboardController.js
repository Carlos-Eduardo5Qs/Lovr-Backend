const { AppError } = require('../../utils/Error');

const Dashboard = require('../../services/DashboardService');

exports.create = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, subtitle, terminal_user, terminal_host, terminal_welcome_msg } = req.body;

        const dashboardData = await new Dashboard().createNewDashboard(userId, {
            title,
            subtitle,
            terminal_user,
            terminal_host,
            terminal_welcome_msg
        });

        return res.status(201).json({
            success: true,
            status: 201,
            message: "Mural criado.",
            data: dashboardData,
            error: null
        });
        
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
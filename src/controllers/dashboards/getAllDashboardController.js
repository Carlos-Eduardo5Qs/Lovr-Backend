const { AppError, NotFoundError } = require('../../utils/Error');

const Dashboard = require('../../services/DashboardService')

exports.getAllCards = async (req, res) => {
    try {
        const userId = req.userId;

        const dashboards = await new Dashboard().getUserDashboards(userId);

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Dados recuperados.",
            data: dashboards,
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
        })
    }
}
const { AppError } = require('../../utils/Error');
const CardService = require('../../services/CardService');

exports.delete = async (req, res) => {
    try {
        const { dashboardId, cardId } = req.params;
        const userId = req.userId;

        await new CardService().deleteCardFromDatabase(cardId, userId, dashboardId);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Card deletado.',
            data: null,
            error: null,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                status: error.statusCode,
                error: error.message,
                data: null
            });
        };

        console.error(error);

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null
        });
    };
};
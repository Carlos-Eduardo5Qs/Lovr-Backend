const { AppError, NotFoundError } = require('../../utils/Error');

const CardService = require('../../services/CardService');

exports.getAllCards = async (req, res) => {
    try {
        const cards = await new CardService().getAllCardsFromDatabase(req.userId);

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Cards recuperados.",
            data: cards,
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

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null
        })
    }
}
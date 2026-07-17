const { AppError, NotFoundError } = require('../../utils/Error');

const CardService = require('../../services/CardService');

exports.update = async (req, res) => {
    try {
        const { position, message} = req.body;
        
        const imageBuffer = req.file ? req.file.buffer : null;
        const mimeType = req.file ? req.file.mimetype : null;

        if (!req.params.dashboardId) throw new NotFoundError('Mural não encontrado.');
        if (!req.params.cardId) throw new NotFoundError('Card não encontrado.');

        const updateData = {};

        if (position !== undefined && position !== null && String(position).trim() !== '') updateData.position_ = position;
        if (message !== undefined && message !== null && String(message).trim() !== '') updateData.back_message = message;

        const cardData = await new CardService().updateCardInTheDatabase(
            req.params.cardId,
            req.userId,
            req.params.dashboardId,
            updateData,
            imageBuffer,
            mimeType
        );

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Card atualizado',
            data: cardData,
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
const { AppError, NotFoundError } = require('../../utils/Error');

const CardService = require('../../services/CardService');

exports.create = async (req, res) => {
    try{
        const { dashboardId } = req.params;
        const { message, position } = req.body;

        const imageBuffer = req.file.buffer
        const mimeType = req.file.mimetype;

        if (!req.userId || !dashboardId || !message || !position || !imageBuffer || !mimeType) {
            throw new NotFoundError('Preencha todos os campos obrigatórios (user_id, dashboardId, message, position e photo).');
        }

        const cardData = await new CardService().saveCardInTheDatabase(req.userId, dashboardId, imageBuffer, mimeType, position, message);

        return res.status(201).json({
            success: true,
            status: 201,
            message: "Card criado",
            data: {
                id: cardData.cardId,
                message,
                position,
                image: {
                    url: cardData.uploadPhoto.url,
                }
            },
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
};

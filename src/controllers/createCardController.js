const { AppError, NotFoundError } = require('../utils/Error');

const CardService = require('../services/CardService');

exports.uploadCards = async (req, res) => {
    try{
        const { user_id, message, position } = req.body;
        const imageBuffer = req.file.buffer
        const mimeType = req.file.mimetype;

        if (!user_id || !message || !position || !imageBuffer || !mimeType) {
            throw new NotFoundError('Preencha todos os campos obrigatórios (user_id, message, position e photo).');
        }

        const cardData = await new CardService().saveCardInTheDatabase(user_id, imageBuffer, mimeType, position, message);

        return res.status(201).json({
            success: true,
            status: 201,
            message: "O card foi criado",
            card: {
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

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null
        })
    }
};

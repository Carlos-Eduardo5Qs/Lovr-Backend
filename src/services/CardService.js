const cloudinary = require('../config/cloudinary');

const { AppError, ValidationError ,NotFoundError } = require('../utils/Error');
const { create } = require('../models/cardModels');
const User = require('../services/UserService');

function Cards () { this.user = new User() }

Cards.prototype.saveCardInTheDatabase = async function (userId, buffer, mimetype, position, back_message) {
    try {
        const id = this.user.isValidUserId(userId);
        const user = await this.user.userIdExists(id);

        if (!user) throw new NotFoundError('Usuário não encontrado.');

        const uploadPhoto = await this.uploadPhotoToCloudinary(buffer, mimetype);
        const cardId = await create (userId, back_message, position, uploadPhoto.url, uploadPhoto.public_id);
        
       return {
        uploadPhoto,
        cardId
    }
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        if (error instanceof ValidationError) throw error;
        if (error instanceof AppError) throw error;

        throw new AppError('Erro interno do servidor.', 500);
    }
};

Cards.prototype.uploadPhotoToCloudinary = async function (buffer, mimetype) {
    try {
        const isValidMimeType = ['image/jpeg', 'image/png'].includes(mimetype);

        if (!isValidMimeType) {
            throw new ValidationError('Tipo de arquivo inválido. Apenas imagens JPEG, PNG e GIF são permitidas.');
        }

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'Lovr_Cards_Images' }, (error, result) => {
                if (error) {
                    reject(new AppError('Erro interno do servidor.', 500));
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Erro interno do servidor.', 500);
    }
};

module.exports = Cards;
const cloudinary = require('../config/cloudinary');

const { AppError, ValidationError ,NotFoundError } = require('../utils/Error');
const { create, getAllcard, getCardByIdAndUser, updateDynamic } = require('../models/cardModels');

const User = require('../services/UserService');

function Cards () { this.user = new User() }

Cards.prototype.saveCardInTheDatabase = async function (userId, buffer, mimetype, position, back_message) {
    const id = this.user.isValidUserId(userId);
    const user = await this.user.userIdExists(id);

    if (!user) throw new NotFoundError('Usuário não encontrado.');

    const uploadPhoto = await this.uploadPhotoToCloudinary(buffer, mimetype);
    const cardId = await create (userId, back_message, position, uploadPhoto.url, uploadPhoto.public_id);
        
    return {
        uploadPhoto,
        cardId
    }
};

Cards.prototype.isValidCardId = function (cardId) {
    if (!cardId) throw new NotFoundError('id ausente.');

    const idNumber = Number(cardId);

    if (isNaN(idNumber) || idNumber <= 0 || !Number.isInteger(idNumber)) {
        throw new ValidationError('id inválido');
    }

    return idNumber;
}

Cards.prototype.updateCardInTheDatabase = async function (cardId, userId, data, buffer, mimetype) {
    const id = this.user.isValidUserId(userId);
    const user = await this.user.userIdExists(id);

    if (!user) throw new NotFoundError('Usuário não encontrado.');

    const cardIdIsValid = this.isValidCardId(cardId);
    const card = await getCardByIdAndUser(cardIdIsValid, userId);

    if (!card) throw new NotFoundError('Card não encontrado');

    if (buffer) {
        const uploadPhoto = await this.uploadPhotoToCloudinary(buffer, mimetype);

        data.image_url = uploadPhoto.url;
        data.image_id = uploadPhoto.public_id;

        if (card.image_id) {
            await cloudinary.uploader.destroy(card.image_id);
        }
    }

    if (Object.keys(data).length === 0) {
        throw new ValidationError('Nenhum dado ou imagem foi enviado para atualização.');
    }

    await updateDynamic(cardIdIsValid, data);

    return {
        id: cardIdIsValid,
        position: data.position_ !== undefined ? Number(data.position_) : card.position_,
        message: data.back_message !== undefined ? data.back_message : card.back_message,
        imageUrl: data.image_url !== undefined ? data.image_url : card.image_url
    };
};

Cards.prototype.uploadPhotoToCloudinary = async function (buffer, mimetype) {
    const isValidMimeType = ['image/jpeg', 'image/png', 'image/webp'].includes(mimetype);

    if (!isValidMimeType) {
        throw new ValidationError('Tipo de arquivo inválido. Apenas imagens JPEG e PNG são permitidas.');
    }

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'Lovr_Cards_Images' }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }).end(buffer);
    });

    return { url: result.secure_url, public_id: result.public_id };
};

Cards.prototype.getAllCardsFromDatabase = async function (userId) {
    const id = this.user.isValidUserId(userId);
    const user = await this.user.userIdExists(id);

    if (!user) throw new NotFoundError('Usuário não encontrado.');

    const list = await getAllcard(id);

    return list;
};

module.exports = Cards;
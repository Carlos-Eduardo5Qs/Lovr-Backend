const { AppError, ValidationError ,NotFoundError } = require('../utils/Error');

const User = require('../services/UserService');

//userId, positon, back_message,

function Cards () { this.user = new User() }

Cards.prototype.create = async function (userId) {
    try {
        const id = this.user.isValidUserId(userId);
        const user = await this.user.userIdExists(id);

        if (!user) throw new NotFoundError('Usuário não encontrado.');

        return user;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        if (error instanceof ValidationError) throw error;
        throw new AppError('Erro interno do servidor.', 500);
    }
};

module.exports = Cards;
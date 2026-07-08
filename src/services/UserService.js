require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { create, checkUserId } = require('../models/userModel');

const { AppError, ValidationError, NotFoundError } = require('../utils/Error');

function User () {}

User.prototype.saveUserInTheDatabase = async function (name, email, password) {
    name = this.isValidName(name);
    email = this.isValidEmail(email);
    password = this.isValidPassword(password);

    const hashPassword = await this.createHashPassword(password);
    const userId = await create (name, email, hashPassword);
    const token = this.createToken({ id: userId });

    return { id: userId, name, email, hashPassword, token };
};

User.prototype.isValidName = function (name) {
    if (!name) throw new NotFoundError('name ausente ou invalido.');
    if (name.length < 3) throw new ValidationError('Nome deve ter pelo menos 3 caracteres.');

    const cleanedName = name.trim();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (!nameRegex.test(cleanedName)) throw new ValidationError('Nome deve conter apenas letras e espaços.');

    return name
};

User.prototype.isValidEmail = function (email) {
    if (!email) throw new NotFoundError('email ausente ou inválido.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new ValidationError('Email inválido.');

    return email;
};

User.prototype.isValidPassword = function (password) {
    if (!password) throw new NotFoundError('password ausente ou invalido.');
    if (password.length < 8) throw new ValidationError('Senha deve ter pelo menos 8 caracteres.');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    if (!passwordRegex.test(password)) throw new ValidationError('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');

    for (let i = 0; i < password.length -2; i ++) {
        const current = password[i];
        const next = password[i + 1];
        const last = password[i + 2];

        if (
            current >= '0' && current <= '9' &&
            next >= '0' && next <= '9' &&
            last >= '0' && last <= '9'
        ) {
            if (
                (Number(next) === Number(current) + 1 && Number(last) === Number(next) + 1) ||
                (Number(next) === Number(current) - 1 && Number(last) === Number(next) - 1)
            ) throw new ValidationError('A senha não deve conter sequências de 3 ou mais números consecutivos.');
        }
    }

    return password;
};

User.prototype.createHashPassword = async function (passwd) {
    try{
        if(!passwd) throw new NotFoundError('password ausente ou inválido.');

        const password = await bcrypt.hash(passwd, 10);

        return password;
    } catch(error) {
        throw new AppError('Erro interno do servidor.', 500);
    };
};

User.prototype.createToken = function (payload) {
    try {
        // Mudar para 7d em produção.
        const token = jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: '7years'});
        return token;
    } catch (error) {
        throw new AppError('Erro interno do servidor.', 500);
    }
};

User.prototype.isValidUserId = function (userId) {
    if (!userId) throw new NotFoundError('id ausente.');

    const idNumber = Number(userId);

    if (isNaN(idNumber) || idNumber <= 0 || !Number.isInteger(idNumber)) {
        throw new ValidationError('id inválido');
    }

    return idNumber;
}

User.prototype.userIdExists = async function (userId) {
    try {
        const userExists = await checkUserId(userId);
        return userExists;
    } catch (error) {
        throw new AppError('Erro interno do servidor.', 500);
    }
};

module.exports = User;
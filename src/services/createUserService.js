require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saveToDatabase = require('../models/createUserModels');

const { AppError, ValidationError, NotFoundError } = require('../utils/Error');

function CreateUser (name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
}

CreateUser.prototype.init = async function () {
    const name = this.isValidName(this.name);
    const email = this.isValidEmail(this.email);
    const password = this.isValidPassword(this.password);
    const hashPassword = await this.createHashPassword(this.password);
    const userId = await saveToDatabase(name, email, hashPassword);
    const token = this.createToken({id: userId, name, email});

    return { id: userId, name, email, hashPassword, token };
};

CreateUser.prototype.isValidName = function (name) {
    if (!name) throw new NotFoundError('Campo name ausente ou invalido.');
    if (name.length < 3) throw new ValidationError('Nome deve ter pelo menos 3 caracteres.');

    const cleanedName = name.trim();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (!nameRegex.test(cleanedName)) throw new ValidationError('Nome deve conter apenas letras e espaços.');

    return name
};

CreateUser.prototype.isValidEmail = function (email) {
    if (!email) throw new NotFoundError('Campo email ausente ou inválido.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new ValidationError('Email inválido.');

    return email;
};

CreateUser.prototype.isValidPassword = function (password) {
    if (!password) throw new NotFoundError('Campo password ausente ou invalido.');
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

CreateUser.prototype.createHashPassword = async function(passwd) {
    try{    
        if(!passwd) throw new NotFoundError('Campo password ausente ou inválido.');

        const password = await bcrypt.hash(passwd, 10);

        return password;
    } catch(error) {
        throw new AppError('Erro interno do servidor.', 500);
    };
};

CreateUser.prototype.createToken = function (payload) {
    try {
        const token = jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: '7d'});
        return token;
    } catch (error) {
        throw new AppError('Erro interno do servidor.', 500);
    }
};
    
module.exports = CreateUser;
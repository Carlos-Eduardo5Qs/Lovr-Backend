const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/Error');
const User = require('../services/UserService');

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const userServiceInstance = new User();

        if (!authHeader) throw new AppError('Token não fornecido.', 401)

        const part = authHeader.split(' ')

        if (part.length !== 2 || part[0] !== 'Bearer') {
            throw new AppError('Formato do token inválido. Use "Bearer <token>".', 401)
        }

        const token = part[1];

        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        if(await userServiceInstance.userIdExists(decoded.id) === false) throw new AppError('Usuário não encontrado.', 404);
        
        req.userId = decoded.id;

        return next();
    } catch (error) {
        if (!error.statusCode) console.error('Erro ou tentativa de invasão no middleware.', error);

        const statusCode = error.statusCode || 500;
        const message = error.statusCode ? error.message : 'Erro interno do servidor.';

        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            error: message,
            data: null
        });
    };
};

module.exports = authMiddleware;
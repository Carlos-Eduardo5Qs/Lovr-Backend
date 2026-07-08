const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/Error');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) throw new AppError('Token não fornecido.', 401)

        const part = authHeader.split(' ')

        if (part.length !== 2 || part[0] !== 'Bearer') {
            throw new AppError('Formato do token inválido. Use "Bearer <token>".', 401)
        }

        const token = part[1];

        jwt.verify(token, process.env.SECRET_JWT, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    error: 'Acesso negado. Token inválido ou expirado.',
                    data: null
                })
            }

            req.userId = decoded.id

            return next()
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.statusCode ? error.message : 'Erro interno do servidor.';

        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            error: message,
            data: null
        });
    }
};

module.exports = authMiddleware;
const User = require('../services/UserService');
const { AppError, NotFoundError } = require('../utils/Error');

exports.create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new NotFoundError('Todos os campos são obrigatórios: name, email e password.');
        };

        const userData = await new User().saveUserInTheDatabase(name, email, password);

        return res.status(201).json({
            success: true,
            status: 201,
            message: "Usuário criado.",
            data: {
                id: userData.id,
                name: userData.name,
                token: userData.token,
            },
            error: null
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                status: error.statusCode,
                error: error.message,
                data: null,
            });
        }

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null,
        });
    }
};
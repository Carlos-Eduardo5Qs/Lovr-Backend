const { AppError } = require('../../utils/Error');

const UserService = require('../../services/UserService');
const { getUserByEmail } = require('../../models/userModel');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userLogin = await new UserService().loginUser(email, password);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Usuário logado.',
            data: userLogin,
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
        };

        console.error(error);

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor.',
            data: null
        });
    };
};
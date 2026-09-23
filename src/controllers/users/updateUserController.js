const { NotFoundError, AppError, Unauthorized } = require('../../utils/Error');

const userService = require('../../services/UserService');

exports.update = async (req, res) => {
    try {
        const data = req.body;

        if (!data.password) throw new Unauthorized();

        if (!data.name && !data.email && !data.access && data.password) {
            throw new NotFoundError('Nenhum dado foi encontrado para atualizar.')
        }

        if (!data || Object.keys(data).length === 0) {
            throw new NotFoundError('Nenhum dado fornecido para atualização.');
        }

        const dataForUpdate = {};

        for (let i = 0; i < Object.keys(data).length; i++) {
            const values = Object.getOwnPropertyNames(data)[i];
            dataForUpdate[values] = data[values];
        }

        const userServiceInstance = await new userService().updateUser(req.userId, dataForUpdate);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Seus dados foram atualizados.',
            data: userServiceInstance,
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
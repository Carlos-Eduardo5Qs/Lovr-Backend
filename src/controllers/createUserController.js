const CreateUser = require('../services/createUserService');

exports.create = (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }

        const userData = new CreateUser(name, email, password).init();

        //... fuction to save userData to the database would go here

        return res.status(201).json({
            success: true,
            status: 201,
            message: "Usuário criado.",
            data: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
            },
            error: null
        });
    } catch (error) {
        if (error.name === 'Error') {
            return res.status(400).json({
                success: false,
                status: 400,
                error: error.message,
                data: null,
            });
        }

        return res.status(500).json({
            success: false,
            status: 500,
            error: 'Erro interno do servidor',
            data: null,
        });
    }
};
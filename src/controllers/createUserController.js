exports.create = (req, res) => {

    console.log(req);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    return res.status(201).json({
        success: true,
        status: 201,
        message: "Usuário criado.",
        data: {
            id: 15,
            name,
            email,
        },
        error: null
    });
};
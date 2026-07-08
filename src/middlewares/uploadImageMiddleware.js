const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('photo');

function uploadImageMiddleware(req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: 'O tamanho da imagem é maior que 5MB.',
                data: null
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                status: 500,
                error: 'Ocorreu um erro ao processar a imagem.',
                data: null
            });
        }
        next();
    });
};

module.exports = uploadImageMiddleware;
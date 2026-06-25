const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('photo');

function uploadImageMiddleware(req, res, next) {
    upload(req, res, function (err) {   
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'O tamanho da imagem é maior que 5MB.' });
        } else if (err) {
            return res.status(500).json({ error: 'Ocorreu um erro ao processar a imagem.' });
        }
        next();
    });
};

module.exports = uploadImageMiddleware;
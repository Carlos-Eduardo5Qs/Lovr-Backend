const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadCardController');
const uploadImageMiddleware = require('../middlewares/uploadImageMiddleware');

router.post('/uploadCards', uploadImageMiddleware, uploadController.uploadCards);

module.exports = router;

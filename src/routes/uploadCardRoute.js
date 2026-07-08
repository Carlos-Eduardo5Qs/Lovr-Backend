const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadCardController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImageMiddleware = require('../middlewares/uploadImageMiddleware');

router.post('/uploadCards',authMiddleware, uploadImageMiddleware, uploadController.uploadCards);

module.exports = router;

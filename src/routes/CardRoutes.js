const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/createCardController');
const authMiddleware = require('../middlewares/authMiddleware');
const photoMiddleware = require('../middlewares/capturePhotoMiddleware');

router.post('/uploadCards',authMiddleware, photoMiddleware, uploadController.uploadCards);

module.exports = router;

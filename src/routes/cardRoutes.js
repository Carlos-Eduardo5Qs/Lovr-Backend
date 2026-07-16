const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const photoMiddleware = require('../middlewares/capturePhotoMiddleware');

const createCardController = require('../controllers/cards/createCardController');
const getAllCardController = require('../controllers/cards/getAllCardController');
const putCardController = require('../controllers/cards/putCardController');

router.post('/card/create',authMiddleware, photoMiddleware, createCardController.create);
router.get('/card/getAll', authMiddleware, getAllCardController.getAllCards);
router.put('/card/update/:cardId', authMiddleware, photoMiddleware, putCardController.update);

module.exports = router;

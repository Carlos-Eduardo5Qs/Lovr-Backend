const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const photoMiddleware = require('../middlewares/capturePhotoMiddleware');

const createCardController = require('../controllers/cards/createCardController');
const getAllCardController = require('../controllers/cards/getAllCardController');
const putCardController = require('../controllers/cards/putCardController');
const deleteCardController = require('../controllers/cards/deleteCardController');

router.post('/dashboard/:dashboardId/card/create',authMiddleware, photoMiddleware, createCardController.create);
router.get('/dashboard/:dashboardId/card/getAll', authMiddleware, getAllCardController.getAllCards);
router.put('/dashboard/:dashboardId/card/update/:cardId', authMiddleware, photoMiddleware, putCardController.update);
router.delete('/dashboard/:dashboardId/card/delete/:cardId', authMiddleware, deleteCardController.delete);

module.exports = router;

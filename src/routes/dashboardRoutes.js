const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const createDashboardController = require('../controllers/dashboards/createDashboardController');
const getAllDashboardController = require('../controllers/dashboards/getAllDashboardController');
const putDashboardController = require('../controllers/dashboards/putDashboard.controller');

router.post('/dashboard/create', authMiddleware, createDashboardController.create);
router.get('/dashboard/getAll', authMiddleware, getAllDashboardController.getAllCards);
router.put('/dashboard/update/:dashboardId', authMiddleware, putDashboardController.update);

module.exports = router;
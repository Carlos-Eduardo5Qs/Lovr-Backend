const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const createDashboardController = require('../controllers/dashboards/createDashboardController');
const getAllDashboardController = require('../controllers/dashboards/getAllDashboardController');
const putDashboardController = require('../controllers/dashboards/putDashboard.controller');
const deleteDashboardController = require('../controllers/dashboards/deleteDashboardController');

router.post('/dashboard/create', authMiddleware, createDashboardController.create);
router.get('/dashboard/getAll', authMiddleware, getAllDashboardController.getAllCards);
router.put('/dashboard/update/:dashboardId', authMiddleware, putDashboardController.update);
router.delete('/dashboard/delete/:dashboardId', authMiddleware, deleteDashboardController.delete);

module.exports = router;
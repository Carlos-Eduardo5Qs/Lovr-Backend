const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const dashboardController = require('../controllers/dashboards/createDashboardController');

router.post('/dashboard/create', authMiddleware, dashboardController.create);

module.exports = router;
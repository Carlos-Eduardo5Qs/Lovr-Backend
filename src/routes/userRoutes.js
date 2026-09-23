const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const createUserController = require('../controllers/users/createUserController');
const loginUserController = require('../controllers/users/loginUserControler');
const updateUserController = require('../controllers/users/updateUserController');


router.post('/user/create', createUserController.create);
router.post('/user/login', loginUserController.login);
router.put('/user/update', authMiddleware, updateUserController.update);

module.exports = router;
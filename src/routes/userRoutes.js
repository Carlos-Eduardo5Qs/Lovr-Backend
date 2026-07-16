const express = require('express');
const router = express.Router();

const createUserController = require('../controllers/users/createUserController');
const loginUserController = require('../controllers/users/loginUserControler');

router.post('/user/create', createUserController.create);
router.post('/user/login', loginUserController.login);

module.exports = router;
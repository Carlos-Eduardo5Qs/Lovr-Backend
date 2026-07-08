const express = require('express');
const router = express.Router();

const createUserController = require('../controllers/createUserController');

router.post('/createUser', createUserController.create);

module.exports = router;
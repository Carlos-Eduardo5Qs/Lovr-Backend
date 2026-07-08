const cors = require('cors');
const express = require('express');

const uploadRoutes = require('../routes/cardRoutes');
const createUserRoute = require('../routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploadRoutes);
app.use(createUserRoute);
module.exports = app;
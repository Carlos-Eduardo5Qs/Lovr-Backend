const cors = require('cors');
const express = require('express');

const uploadRoutes = require('../routes/uploadCardRoute');
const createUserRoute = require('../routes/createUserRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploadRoutes);
app.use(createUserRoute);
module.exports = app;
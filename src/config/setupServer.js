const cors = require('cors');
const express = require('express');

const cardsRoutes = require('../routes/cardRoutes');
const usersRoutes = require('../routes/userRoutes');
const dashboardsRoutes = require('../routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cardsRoutes);
app.use(usersRoutes);
app.use(dashboardsRoutes);

module.exports = app;
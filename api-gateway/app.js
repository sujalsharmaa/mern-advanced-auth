const express = require('express');
const routes = require('./routes/index');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the API routes
app.use('/', routes);

module.exports = app;

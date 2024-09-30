const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
require('dotenv').config();
const cookieParser = require("cookie-parser")
const cors = require('cors')
const bodyParser = require('body-parser');




const app = express();

// Connect to MongoDB
app.use(cors({
    origin: 'http://localhost:5173', // Only allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',   // Define allowed HTTP methods
    credentials: true                 // If you are using credentials (cookies, etc.)
}));


// app.use(cors({ origin: "http://localhost:5003", credentials: true }));

mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/todos', todoRoutes);

module.exports = app;

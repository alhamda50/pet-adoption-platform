const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require("fs");
const path = require('path');
require('dotenv').config();

require('./db/connection');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, 'public')));
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
const petRoute = require('./Routes/basicRoutes');
app.use('/pet', petRoute);

const userRoute = require('./Routes/user');
app.use('/user', userRoute);

const pRoute = require('./Routes/petRoutes');
app.use('/p', pRoute);  // Using /p as the route prefix

const adminRoute = require('./Routes/admin'); // Include admin routes
app.use('/admin', adminRoute); // Use /admin as the route prefix

app.listen(3000, () => {
    console.log("Server is up and listening on port 3000");
});

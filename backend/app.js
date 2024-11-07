const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');



require('dotenv').config();

require('./db/connection')


const app = new express();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(cors());


const petRoute = require('./Routes/basicRoutes');
app.use('/pet', petRoute)
const userRoute = require('./Routes/user')
app.use("/user",userRoute)

const pRoute = require('./Routes/petRoutes');
app.use('/p', pRoute);  // Using /p as the route prefix

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(3000, () => {
    console.log("server is up and listening on port 3000");
})
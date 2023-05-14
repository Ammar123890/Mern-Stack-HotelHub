const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('./Routes/userRoutes')
const adminRouter = require('./Routes/adminRoutes')
const bookingRoutes = require('./Routes/bookingRoutes')
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/bookings', bookingRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening at port ${process.env.PORT}`)
})


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));

//Need to implement Forgot Password
//Need to implement Reset Password
//Need to implement Email Verification

//Changed user schema in accordance with profile updation
//Added profile picture to User Schema
//Implemented Booking on the basis of Hotel Id.
//Added Booking schema. 
//changed user schema in accordance with booking
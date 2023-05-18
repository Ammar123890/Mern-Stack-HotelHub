const mongoose = require('mongoose');	
const express = require('express');

const adminRouter_room = require('./Routes/adminRoutes/roomRoutes')
const adminRouter_hotel = require('./Routes/adminRoutes/hotelRoutes')
const adminRouter_auth = require('./Routes/adminRoutes/authRoutes')

const userRouter_auth = require('./Routes/userRoutes/authRoutes')


require('dotenv').config();

const app = express();
app.use(express.json());



app.use('/admin/room',adminRouter_room);
app.use('/admin/hotel',adminRouter_hotel);
app.use('/admin/auth',adminRouter_auth);
app.use('/user/auth',userRouter_auth)

app.listen(process.env.PORT||3000, ()=>{
    console.log(`App listening at port ${process.env.PORT}`)
})


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('Connected to MongoDB')).catch((err)=>console.log(err));


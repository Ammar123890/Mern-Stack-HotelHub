const adminRouter_hotel = require('express').Router();
const {
    addHotel,
    deleteHotel,
    updateHotel,
    getHotels,
    getHotelById
} = require('../../Controllers/adminController/hotelController')
const { verifyAdmin, verifyToken } = require('../../Middlewares/userMiddleware')



adminRouter_hotel.post('/addHotel', verifyToken, verifyAdmin, addHotel)
adminRouter_hotel.delete('/deleteHotel/:id', verifyToken, verifyAdmin, deleteHotel)
adminRouter_hotel.put('/updateHotel/:id', verifyToken, verifyAdmin, updateHotel)
adminRouter_hotel.get('/getHotels', verifyToken, verifyAdmin, getHotels)
adminRouter_hotel.get('/getHotelById/:id', verifyToken, verifyAdmin, getHotelById)



module.exports = adminRouter_hotel;
const express = require('express');
const router = express.Router();
const { deleteBooking, getBookingByID, getBookings, updateBooking, addNewBooking } = require('../Controllers/bookingController.js')
const {verifyUser, verifyToken,verifyAdmin} = require('../Middlewares/userMiddleware.js')

// Create a new booking
router.post('/',addNewBooking);
// router.post('/',verifyToken,verifyUser, addNewBooking);

// Get all bookings for a specific user
router.get('/:userId/bookings',verifyToken,verifyUser, getBookings);

// Get a specific booking by ID
router.get('/:bookingId',verifyToken,verifyUser, getBookingByID);

// Update a specific booking by ID
router.put('/:bookingId',verifyToken,verifyUser, updateBooking);

// Delete a specific booking by ID
router.delete('/:bookingId',verifyToken,verifyUser, deleteBooking);

module.exports = router;

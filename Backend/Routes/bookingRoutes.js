const express = require('express');
const router = express.Router();
const { deleteBooking, getBookingByID, getBookings, updateBooking, addNewBooking } = require('../Controllers/bookingController.js')

// Create a new booking
router.post('/', addNewBooking);

// Get all bookings for a specific user
router.get('/:userId', getBookings);

// Get a specific booking by ID
router.get('/:bookingId', getBookingByID);

// Update a specific booking by ID
router.put('/:bookingId', updateBooking);

// Delete a specific booking by ID
router.delete('/:bookingId', deleteBooking);

module.exports = router;

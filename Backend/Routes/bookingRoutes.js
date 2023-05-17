const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController.js');

// Create a new booking
router.post('/bookings', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get a single booking by ID
router.get('/bookings/:id', bookingController.getBookingById);

// Update a booking
router.put('/bookings/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;

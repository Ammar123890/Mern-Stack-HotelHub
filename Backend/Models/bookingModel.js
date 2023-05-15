const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  hotelID: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  numberOfRooms: {
    type: Number,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

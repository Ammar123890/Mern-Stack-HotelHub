const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  check_in_date: Date,
  check_out_date: Date,
  guests_count: Number,
  total_price: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

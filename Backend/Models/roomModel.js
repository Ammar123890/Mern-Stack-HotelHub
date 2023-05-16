const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    room_type: String,
    capacity: Number,
    price_per_night: Number,
});
const Room = mongoose.model('Room', roomSchema);

module.exports =
    Room
    ;

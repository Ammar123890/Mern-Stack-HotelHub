const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },

    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
    ],

})

module.exports = mongoose.model('User', userSchema);
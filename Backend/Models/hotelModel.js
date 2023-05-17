const mongoose = require('mongoose');
const hotelSchema = mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    location: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: String
    },
    stars: {
        required: true,
        type: Number
    },
    faclities: [
        {
            facilityName: String,
            facilityAvailability: Boolean
        }
    ],
    hotelImages: [
        {
            imageUrl: String
        }
    ],
    comments: [
        {
            booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
            comment: String,
            commented_on: { type: Date, default: Date.now },
            commented_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            stars: Number
        }
    ]
}
)


module.exports = mongoose.model('Hotel', hotelSchema);
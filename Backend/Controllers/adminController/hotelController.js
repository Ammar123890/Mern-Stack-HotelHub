const Hotel = require('../../Models/hotelModel')

const addHotel = (req, res) => {
    const { name, description, location, rooms, amenities } = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        description: description,
        location: location,
        city: req.body.city, // Add the 'city' field
        state: req.body.state, // Add the 'state' field
        country: req.body.country, // Add the 'country' field
        stars: req.body.stars, // Add the 'stars' field
        rooms: rooms,
        facilities: amenities, // Rename 'amenities' to 'facilities'
        hotelImages: req.body.hotelImages // Add the 'hotelImages' field
    };

    const newHotel = new Hotel(hotelData);
    const validationError = newHotel.validateSync();

    if (validationError) {
        const errorMessage = validationError.errors[Object.keys(validationError.errors)[0]].message;
        res.status(400).send({ message: 'Validation Error', error: errorMessage });
        return;
    }

    // Save the new hotel document
    newHotel.save()
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully added hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error adding hotel', error: err });
        });
};



const deleteHotel = (req, res) => {
    const { id } = req.params;
    Hotel.findByIdAndDelete(id)
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully deleted hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error deleting hotel', error: err });
        });
}


const updateHotel = (req, res) => {
    const { id } = req.params;
    const { name, location, city, state, country, stars, rooms, facilities, hotelImages } = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        location: location,
        city: city,
        state: state,
        country: country,
        stars: stars,
        rooms: rooms,
        facilities: facilities,
        hotelImages: hotelImages
    };

    const newHotel = new Hotel(hotelData);
    const validationError = newHotel.validateSync();

    if (validationError) {
        const errorMessage = validationError.errors[Object.keys(validationError.errors)[0]].message;
        res.status(400).send({ message: 'Validation Error', error: errorMessage });
        return;
    }

    // Update the hotel document
    Hotel.findByIdAndUpdate(id, hotelData, { new: true })
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully updated hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error updating hotel', error: err });
        });
};


const getHotels = (req, res) => {
    Hotel.find()
        .then((hotels) => {
            res.status(200).send({ message: 'Successfully retrieved hotels', hotels: hotels });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error retrieving hotels', error: err });
        });
}





const getHotelById = async (req, res) => {
    const { id } = req.params;
    try {
        const hotel = await Hotel.findById(id);
        res.status(200).send({ message: 'Successfully retrieved hotel', hotel: hotel });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving hotel', error: error });
    }
}




module.exports = {

    addHotel,
    deleteHotel,
    updateHotel,
    getHotels,
    getHotelById
}

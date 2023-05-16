const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/roomController.js');

// Create a new room
router.post('/addRoom', roomController.createRoom);
router.post('/addRooms', roomController.addMultipleRooms);

// Get all rooms
router.get('/rooms', roomController.getAllRooms);

// Get a single room by ID
router.get('/rooms/:id', roomController.getRoomById);

// Update a room
router.put('/rooms/:id', roomController.updateRoom);

// Delete a room
router.delete('/rooms/:id', roomController.deleteRoom);

module.exports = router;

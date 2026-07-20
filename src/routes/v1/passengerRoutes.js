const express = require('express');
const {
    createBooking, 
    } = require('../../controllers/passengerController');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const passengerRouter = express.Router();

passengerRouter.post('/ride', 
    authMiddleware,
    authorizeRoles('passenger'), 
    createBooking);

// passengerRouter.get('/bookings',
//     authMiddleware, 
//     authorizeRoles('passenger'),
//     getPassengerBookings);

module.exports = passengerRouter;
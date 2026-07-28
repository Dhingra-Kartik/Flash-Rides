const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');
const {
    updateLocation,
    confirmBooking,
    updateBookingStatus
} = require('../../controllers/driverController');

const bookingsRouter = express.Router();

// bookingsRouter.post('/new', authMiddleware, createBooking);
bookingsRouter.post('/confirm', 
    authMiddleware,
    authorizeRoles('driver'),  
    confirmBooking);

bookingsRouter.patch(
    '/status',
    authMiddleware,
    authorizeRoles('driver'),
    updateBookingStatus
);
module.exports = bookingsRouter;
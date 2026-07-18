const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const driverRouter = express.Router();

driverRouter.get('/bookings', 
    authMiddleware,      //is the JWT valid ?? yes then check
    authorizeRoles('DRIVER'), getDriverBookings);   //hey are you verified DRIVER 

driverRouter.post('/location',
    authMiddleware,
    authorizeRoles('DRIVER'), 
    updateLocation);

module.exports = driverRouter;
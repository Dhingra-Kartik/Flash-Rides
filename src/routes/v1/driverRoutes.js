const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');
const {updateLocation, getDriverBookings} = require('../../controllers/driverController');

const driverRouter = express.Router();

driverRouter.get('/bookings', 
    authMiddleware,      //is the JWT valid ?? yes then check
    authorizeRoles('driver'), getDriverBookings);   //hey are you verified DRIVER 

driverRouter.post('/location',
    authMiddleware,
    authorizeRoles('driver'), 
    updateLocation);

module.exports = driverRouter;
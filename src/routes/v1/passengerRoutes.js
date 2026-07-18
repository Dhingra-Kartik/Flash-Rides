const express = require('express');

const passengerRouter = express.Router();

passengerRouter.get('/bookings', getPassengerBookings);

module.exports = passengerRouter;
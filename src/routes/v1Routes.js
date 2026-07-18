const express = require('express');
const authRouter = require('./v1/authRoutes');
const bookingsRouter = require('./v1/bookingRoutes');
const driverRouter = require('./v1/driverRoutes');
const passengerRouter = require('./v1/passengerRoutes');

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/bookings', bookingsRouter);
v1Router.use('/driver', driverRouter);
v1Router.use('/passenger', passengerRouter);

module.exports = v1Router;
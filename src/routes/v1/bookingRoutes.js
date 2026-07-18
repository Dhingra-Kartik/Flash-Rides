const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');

const bookingsRouter = express.Router();

bookingsRouter.post('/new', authMiddleware, createBooking);
bookingsRouter.post('/confirm', authMiddleware, confirmBooking);

module.exports = bookingsRouter;
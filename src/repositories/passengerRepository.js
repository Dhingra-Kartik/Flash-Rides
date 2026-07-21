const Booking = require("../models/bookings");
const User = require('../models/userModel');

const createBooking = async(bookingData) =>{

    const booking = new Booking(bookingData);
    await booking.save();
    return booking;

}

const updateLocation = async(driverId, location) =>{
    const updatedLocation = await User.findByIdAndUpdate(driverId, {location}, {
        new: true
    })
}

module.exports = {
    createBooking,
    updateLocation};
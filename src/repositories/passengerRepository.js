const Booking = require("../models/bookings");
const User = require('../models/userModel');
const mongoose = require('mongoose');

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

const confirmBooking = async (bookingId, driverId) => {

    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            status: 'pending'
        },
        {
            driver: driverId,
            status: 'confirmed'
        },
        {
            new: true
        }
    );

    return booking;
};

const addNotifiedDrivers = async (bookingId, driverIds) => {

    const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
            notifiedDrivers: driverIds
        },
        {
            new: true
        }
    );

    return booking;
};

const getPassengerBookings = async(passengerId, page=1, limitNo=3) =>{
    const bookings = await Booking.find({passenger: passengerId}, {notifiedDrivers: 0})
    .populate('driver', 'name')
    .populate('passenger', 'name')
    .sort({createdAt: -1})
    .skip((page-1)*limitNo)
    .limit(limitNo);

    return bookings;
}
    
module.exports = {
    createBooking,
    updateLocation,
    confirmBooking,
    addNotifiedDrivers,
    getPassengerBookings
};
const Booking = require("../models/bookings");
const User = require('../models/userModel');

const findActiveBooking = async(driverId)=>{
    const booking = await Booking.findOne({
    driver: driverId,
    status: {
        $in: [
            "confirmed",
            "driver_arriving",
            "driver_arrived",
            "ride_started"
        ]
    }
});

if (!booking) {
    return;
}

return booking;
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

const updateLocation = async(driverId, location) =>{
    const updatedLocation = await User.findByIdAndUpdate(driverId, {location}, {
        new: true
    })
}

module.exports = {
    findActiveBooking,
    confirmBooking,
    updateLocation
}
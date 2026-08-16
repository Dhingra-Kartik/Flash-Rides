const validTransitions = require('../utils/validTransitions');
const Booking = require('../models/bookings');
const axios = require('axios');
const tripService = require('./tripService');
const BASE_FARE = 30;
const KM_FARE = 12;

const transitionBookingStatus = async (
    bookingId,
    driverId,
    newStatus
) => {
    const booking = await Booking.findById(bookingId);

    //is there a booking with bookingId received, otherwise throw error
    if (!booking) {
        throw new Error('Booking not found');
    }

    // driver assigned to this booking
    // will be the one changing its status
    if (
        booking.driver.toString() !== driverId.toString()
    ) {
        throw new Error(
            'You are not assigned to this booking'
        );
    }

    const allowedTransitions =
        validTransitions[booking.status];

    if (
        !allowedTransitions ||
        !allowedTransitions.includes(newStatus)
    ) {
        throw new Error(
            `Cannot move booking from ${booking.status} to ${newStatus}`
        );
    }

    booking.status = newStatus;

    await booking.save();
    await axios.post(
        process.env.NOTIFY_PASSENGER_STATUS_URL,
        {
            passengerId: booking.passenger,
            bookingId: booking._id,
            status: booking.status
        }
    )
    if(newStatus == "in_progress"){
        console.log("INTO THE INITIALIZING FROM BOOKINGSERVICE")
        await tripService.initializeTrip(
            booking._id,
            booking.source.latitude,  //driver would ofcourse start from source lat & long
            booking.source.longitude
        )
    }
    if(newStatus == "completed"){
        const actualDistance = await tripService.getTripDistance(bookingId);
        const finalFare = BASE_FARE + (actualDistance * KM_FARE);
        booking.actualDistance = actualDistance;
        booking.finalFare = finalFare;
        booking.fare = finalFare;
        await booking.save();

    await axios.post(process.env.SOCKET_SERVICE_DRIVER_AVAILABILITY, {
        driverId: booking.driver,
        status: "available"
    })
    await tripService.clearTrip(bookingId);
    }
    return booking;
}

const getDriverBookings = async (driverId) => {
    return await Booking.find({ driver: driverId })
        .populate("passenger", "name email")
        .sort({ createdAt: -1 });
};

module.exports = {
    transitionBookingStatus,
    getDriverBookings
};
const validTransitions = require('../utils/validTransitions');
const Booking = require('../models/bookings');

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

    return booking;
}

module.exports = {
    transitionBookingStatus
};
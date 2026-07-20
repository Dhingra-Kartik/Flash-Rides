const bookingService = require('../repositories/passengerRepository');
const {haversineDistance} = require('../utils/haversineDistance');

const BASE_FARE = 30;
const KM_FARE = 12;

const createBooking = async ({passengerId, source, destination}) =>{


    const distance = haversineDistance(source.latitude, source.longitude, destination.latitude, destination.longitude)
    const fare = BASE_FARE + (distance * KM_FARE);
    const bookingData = {
        passenger: passengerId,
        source,
        destination,
        distance,
        fare,
        status: 'pending'
    }

    const booking = await bookingService.createBooking(bookingData);
    return booking;
}

module.exports = {
    createBooking
}
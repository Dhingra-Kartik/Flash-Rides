const bookingService = require('../repositories/passengerRepository');
const {haversineDistance} = require('../utils/haversineDistance');
const { redisClient } = require('../utils/redisClient');
const locationService = require('./locationUpdate'); 

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

const findNearbyDrivers = async(location, radius=5)=>{
    const lon =parseFloat(location.longitude);
    const lat =parseFloat(location.latitude);

    const radius = parseFloat(radius);

    const nearbyDrivers = await locationService.findNearbyDrivers(lon, lat, radius);
    return nearbyDrivers;

}

module.exports = {
    createBooking,
    findNearbyDrivers
}
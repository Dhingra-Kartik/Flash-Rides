//import the redis client the location services.
const {redisClient} = require('../utils/redisClient');
const locationService = require('./locationUpdate'); 
const passengerRepository = require('../repositories/passengerRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const axios = require('axios');

const updateLocation = async(driverId, {latitude, longitude}) => {


    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    try {
        //update driver location to REDIS DB
        const res = await locationService.addDriverLocation(driverId, lon, lat);
        //u can also update the same in mongoDB too
        await passengerRepository.updateLocation(driverId, {
            type: 'Point',
            coordinates: [lon, lat]
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const confirmBooking = async (
    bookingId,
    driverId
) => {

    const booking =
        await passengerRepository.confirmBooking(
            bookingId,
            driverId
        );

    if (!booking) {
        throw new Error(
            'Booking is no longer available'
        );
    }

    const otherDriverIds =
    booking.notifiedDrivers
        .filter(
            notifiedDriverId =>
                notifiedDriverId.toString()
                !== driverId.toString()
        )
        .map(
            notifiedDriverId =>
                notifiedDriverId.toString()
        );

    if (otherDriverIds.length > 0) {
        await axios.post(
            process.env.REMOVE_RIDE_NOTIFICATION_URL,
            {
           rideId:
                    booking._id.toString(),
                driverIds:
                    otherDriverIds
            }
        );
    }
    return booking;
};

const getDashboard = async (driverId)=>{
    return await dashboardRepository.getDashboard(driverId);
};
const getEarningsTrend = async (driverId)=>{
    return await dashboardRepository.getEarningsTrend(driverId);
};

const getPerformance = async(driverId)=>{
    return await dashboardRepository.getPerformance(driverId);
}



module.exports ={
    updateLocation,
    confirmBooking,
    getDashboard,
    getEarningsTrend,
    getPerformance
}
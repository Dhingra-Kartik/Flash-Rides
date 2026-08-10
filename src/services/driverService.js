//import the redis client the location services.
const {redisClient} = require('../utils/redisClient');
const locationService = require('./locationUpdate'); 
const passengerRepository = require('../repositories/passengerRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const driverRepository = require('../repositories/driverRepository');
const axios = require('axios');

const updateLocation = async(driverId, {latitude, longitude}) => {


    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    try {
        //update driver location to REDIS DB
        const res = await locationService.addDriverLocation(driverId, lon, lat);
        //u can also update the same in mongoDB too
        await driverRepository.updateLocation(driverId, {
            type: 'Point',
            coordinates: [lon, lat]
        })

    //now driver updated the location is the driver currently on ACTIVE RIDE?
    const booking = await driverRepository.findActiveBooking(driverId);
    if(!booking){
        return;
    }
    //once we get active booking, lets tell socket service location of driverId
    await axios.post(
        process.env.SOCKET_SERVICE_PASSENGER_LOCATION, {
            passengerId: booking.passenger,
            bookingId: booking._id,
            driverLocation: {
                latitude: lat,
                longitude: lon
            }
        }
    );

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
        await driverRepository.confirmBooking(
            bookingId,
            driverId
        );

    if (!booking) {
        throw new Error(
            'Booking is no longer available'
        );
    }

    await axios.post(process.env.SOCKET_SERVICE_DRIVER_AVAILABILITY, {
        driverId,
        status: "on_trip"
    })

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
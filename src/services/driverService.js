//import the redis client the location services.
const {redisClient} = require('../utils/redisClient');
const locationService = require('./locationUpdate'); 
const passengerRepository = require('../repositories/passengerRepository');
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

// Socket connection mapping
const setDriverSocket = async (driverId, socketId) => {

    await redisClient.hSet(
        'driver_sockets',
        driverId.toString(),
        socketId
    );
};


const getDriverSocket = async (driverId) => {

    return await redisClient.hGet(
        'driver_sockets',
        driverId.toString()
    );
};


const removeDriverSocket = async (driverId, socketId) => {

    const currentSocketId = await redisClient.hGet(
        'driver_sockets',
        driverId.toString()
    );
// Only delete if this is still the active socket
    if (currentSocketId === socketId) {

        await redisClient.hDel(
            'driver_sockets',
            driverId.toString()
        );
    }
};

module.exports ={
    updateLocation,
    confirmBooking,
    setDriverSocket,
    getDriverSocket,
    removeDriverSocket
}
const bookingService = require('../services/passengerService');
const axios = require('axios');


// const createBooking = (passengerData) => async (req, res) => {
const createBooking = async (req, res) => {
    try {
        //first thing is destructure incoming request
        const { source, destination } = req.body;
        //create the booking or booking object
        const booking = await bookingService.createBooking({
            passengerId: req.user.id,
            source,
            destination
        });
        //find nearby drivers from REDISDB

        const nearbyDrivers = await bookingService.findNearbyDrivers(source);

        console.log(
    'RAW NEARBY DRIVERS:',
    JSON.stringify(nearbyDrivers, null, 2)
    );


        const driverIds =
            nearbyDrivers.map(
                driver => driver[0]
            );
           
        //since i have nearby drivers now I need them in booking object what all drivers were informed 
        await bookingService.addNotifiedDrivers(
            booking._id,
            driverIds
        );


        console.log(
            'Nearby drivers:',
            driverIds
        );

        console.log('SENDING NOTIFICATION REQUEST:', {
rideId: booking._id,
driverIds
});
        //Notify thenearby drivers, accept or reject.
        if (driverIds.length > 0) {
            console.log('SENDING NOTIFICATION REQUEST:', {
    rideId: booking._id,
    driverIds
});

            await axios.post(`${process.env.SOCKET_SERVICE}`,

                {rideId: booking._id.toString(),

                rideInfo: {
                    source, 
                    destination, 
                    estimatedFare: booking.fare
                },
                driverIds

                }
            );
        }
        return res.status(201).json({
                    sucess: true,
                    message: "Your booking has been created succesfully",
                    data: booking
                })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

module.exports = {
        createBooking
    }
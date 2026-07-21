const bookingService = require('../services/passengerService');

// const createBooking = (passengerData) => async (req, res) => {
const createBooking = async (req, res) => {
    try {
        //first thing is destructure incoming request
        const {source, destination } = req.body;
        //create the booking or booking object
        const booking = await bookingService.createBooking({
            passengerId: req.user.id, 
            source, 
            destination});
        //find nearby drivers from REDISDB
        //Notify thenearby drivers, accept or reject.
        
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
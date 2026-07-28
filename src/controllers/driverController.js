const driverService = require('../services/driverService');
const bookingService = require('../services/bookingService');

const updateLocation = async(req, res) => {
    
    try {
        const {latitude, longitude} = req.body;
        if(typeof(latitude)!= 'number' ||typeof(longitude)!= 'number' ){
            throw new Error("Enter VALID LAT & LONG !!");
        }

        const location = await driverService.updateLocation(req.user.id, {latitude, longitude});
        res.status(201).json({
            succes: true,
            message: "Location updated successfully",
            data: location
        })
        


    } catch (error) {
        console.log(error);
        res.status(400).send({error: error.message})
        
    }
}

const confirmBooking = async (req, res) => {

    try {

        const {
            bookingId
        } = req.body;


        if (!bookingId) {

            return res.status(400).json({

                success: false,

                message:
                    'Booking ID is required'

            });

        }


        const booking =
            await driverService.confirmBooking(

                bookingId,

                req.user.id

            );


        return res.status(200).json({

            success: true,

            message:
                'Booking confirmed successfully',

            data: booking

        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const updateBookingStatus = async (req, res) => {

    try {
        const { bookingId, newStatus } = req.body;
        if (!bookingId || !newStatus) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID and new status are required'
            });

        }
const booking =
    await bookingService.transitionBookingStatus(
        bookingId,
        req.user.id,
        newStatus
    );

    return res.status(200).json({
        success: true,
        message: `Booking status updated to ${newStatus}`,
        data: booking
    });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




module.exports = {
    updateLocation,
    confirmBooking,
    updateBookingStatus

}
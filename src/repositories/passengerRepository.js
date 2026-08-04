const Booking = require("../models/bookings");
const User = require('../models/userModel');
const mongoose = require('mongoose');

const createBooking = async(bookingData) =>{

    const booking = new Booking(bookingData);
    await booking.save();
    return booking;

}

const updateLocation = async(driverId, location) =>{
    const updatedLocation = await User.findByIdAndUpdate(driverId, {location}, {
        new: true
    })
}

const confirmBooking = async (bookingId, driverId) => {

    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            status: 'pending'
        },
        {
            driver: driverId,
            status: 'confirmed'
        },
        {
            new: true
        }
    );

    return booking;
};

const addNotifiedDrivers = async (bookingId, driverIds) => {

    const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
            notifiedDrivers: driverIds
        },
        {
            new: true
        }
    );

    return booking;
};

const getPassengerBookings = async(passengerId, page=1, limitNo=3) =>{
    const bookings = await Booking.find({passenger: passengerId}, {notifiedDrivers: 0})
    .populate('driver', 'name')
    .populate('passenger', 'name')
    .sort({createdAt: -1})
    .skip((page-1)*limitNo)
    .limit(limitNo);

    return bookings;
}

const overallStatistics = async(driverId) =>{
    const stats = await Booking.aggregate([  
        //first query
        {
            $match: {
            driver: new mongoose.Types.ObjectId(driverId),
            status: "completed"
        }
        },
        //another query
        {
            $group:{
                _id: null,

                totalEarnings: {
                    $sum: "$fare"
                },

                completedTrips: {
                    $sum: 1
                },

                averageFare: {
                    $avg: "$fare"
                },

                highestFare: {
                    $max: "$fare"
                },

                lowestFare: {
                    $min: "$fare"
                }
            }
        }
    ]);

    return stats[0] || {
        totalEarnings: 0,
        completedTrips: 0,
        averageFare: 0,
        highestFare: 0,
        lowestFare: 0
    };
}

const todayStatus = async(driverId) =>{

    try{
        const startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);

        const todayStats = await Booking.aggregate([
            //first query
        {
            $match: {
            driver: new mongoose.Types.ObjectId(driverId),
            status: "completed",
            createdAt: {
                $gte: startOfToday
            }
        }
        },
        //another query
        {
            $group:{
                _id: null,

                totalEarnings: {
                    $sum: "$fare"
                },

                todayTrips: {
                    $sum: 1
                }
            }
        }
    ]);

    return todayStats[0] || {
        todayEarnings: 0,
        todayTrips: 0
    };
    } catch(err) {
        console.log(err);
    }
}

const getDashboard = async(driverId)=>{
    const [
    overall,
    today
    // week,
    // month
] = await Promise.all([  //promise.all orders pizza, burger, chilly potato, pasta all at once rather visiting shops one by one
    overallStatistics(driverId),
    todayStatus(driverId)
    // weekStats(driverId),
    // monthStats(driverId)
]);

return {
    ...overall,
    ...today
    // ...week,
    // ...month
};
}
    
module.exports = {
    createBooking,
    updateLocation,
    confirmBooking,
    addNotifiedDrivers,
    getPassengerBookings,
    getDashboard
};
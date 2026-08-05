const Booking = require("../models/bookings");
const User = require('../models/userModel');
const mongoose = require('mongoose');

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

const getWeekStats = async(driverId) => {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay(); //getDay returns 0 to 6 for sunday to saturday
    //whatever the day is today we want to go back to monday
    const diff = day === 0 ? -6 : 1 - day;  //if sunday go 6 days back to monday
    // otherwise whatever day we have subtract it from 1 it to get number days to go back to get monday
    //now we have number of days to go back to. let us go back now
    startOfWeek.setDate(startOfWeek.getDate() + diff); //it sets the start to monday of the week
    startOfWeek.setHours(0, 0, 0, 0); //setup day hours to ZERO 00H, 00M, 00S, 00MS

        const weeklyStats = await Booking.aggregate([
            //first query
        {
            $match: {
            driver: new mongoose.Types.ObjectId(driverId),
            status: "completed",
            createdAt: {
                $gte: startOfWeek
            }
        }
        },
        //another query
        {
            $group:{
                _id: null,

                weeklyEarnings: {
                    $sum: "$fare"
                },

                weeklyTrips: {
                    $sum: 1
                }
            }
        }
    ]);

    return weeklyStats[0] || {
        weeklyEarnings: 0,
        weeklyTrips: 0
    };
}
const getMonthStats = async(driverId) => {
    const startOfMonth  = new Date();
   
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

        const monthlyStats = await Booking.aggregate([
            //first query
        {
            $match: {
            driver: new mongoose.Types.ObjectId(driverId),
            status: "completed",
            createdAt: {
                $gte: startOfMonth
            }
        }
        },
        //another query
        {
            $group:{
                _id: null,

                monthlyEarnings: {
                    $sum: "$fare"
                },

                monthlyTrips: {
                    $sum: 1
                }
            }
        }
    ]);

    return monthlyStats[0] || {
        monthlyEarnings: 0,
        monthlyTrips: 0
    };
}

const getEarningsTrend = async(driverId) =>{
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() - 30)  //getting us past 30 days not THIS MONTH

    const trend = await Booking.aggregate([
        {
            $match: { 
                driver: new mongoose.Types.ObjectId(driverId),
                status: "completed",
                createdAt: {
                    $gte: thirtyDays
                    }
            }
        },

        {
            $group: {
                _id: {
                    $dateToString: {  //because our createdAt stores time too, need only date
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                    }
                },

                earnings: {
                $sum: "$fare"
                }
            }
        },

        {
            $sort: {
                _id: 1
            }
        },

        {
            $project:{
                _id: 0,
                date: "$_id",
                earnings: 1
            }
        }

    ]);

    return trend;
}

const getDashboard = async(driverId)=>{
    const [
    overall,
    today,
    week,
    month
] = await Promise.all([  //promise.all orders pizza, burger, chilly potato, pasta all at once rather visiting shops one by one
    overallStatistics(driverId),
    todayStatus(driverId),
    getWeekStats(driverId),
    getMonthStats(driverId)
]);

return {
    ...overall,
    ...today,
    ...week,
    ...month
};
}
    
module.exports = {
    getDashboard,
    getEarningsTrend
};
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    passenger: 
    {type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ride-Matching-Users', required: true},

    driver: 
    {type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ride-Matching-Users', default: null},  //at start while making creating booking request, our driver would be NULL
    
        notifiedDrivers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride-Matching-Users'
    }
],

    source: {   //a booking must have source/pickup
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
    },

    destination: {   //a booking must also have a destination/departure 
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
    },

    fare: Number,     //we will hardcode this fare for sec next we fare estimate later

    estimatedDistance: Number,
    estimatedFare: Number,
    actualDistance: {
        type: Number,
        default: 0
    },

    finalFare: {
        type: Number,
        default: 0
    },

    distance: Number,
    status: {type: String, enum: ['pending', 'cancelled', 'confirmed', 'completed', 'driver_arriving', 'driver_arrived', 'in_progress'], default: "pending"}  //a booking has a status too that will be updated later
    
}, {
    timestamps: true
}
);

const Booking = mongoose.model('Ride-Matching-Bookings', bookingSchema);

module.exports = Booking;
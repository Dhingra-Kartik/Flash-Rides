const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['driver', 'passenger', 'admin'],
            default: 'passenger'
        },

        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },

            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({   //Creating an index why to query on location data
    location: '2dsphere'  //specific for querying, store geo-spatial data, lat, long, etc.
});

const User = mongoose.model('Ride-Matching-Users', userSchema);

module.exports = User;
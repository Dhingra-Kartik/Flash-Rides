const redisClient = require('../utils/redisClient');

const getDistanceKey = (bookingId) => `trip:${bookingId}:distance`;

const getLastLocationKey = (bookingId) => `trip:${bookingId}:last_location`;

const initializeTrip = async (bookingId, latitude, longitude) => {

    await redisClient.set(
        getDistanceKey(bookingId),
        "0"
    );

    await redisClient.set(
        getLastLocationKey(bookingId),
        JSON.stringify({
            latitude,
            longitude
        })
    );
};

const getLastLocation = async (bookingId) => {

    const location = await redisClient.get(
        getLastLocationKey(bookingId)
    );

    return location ? JSON.parse(location) : null;
};

const getTripDistance = async (bookingId) => {

    const distance = await redisClient.get(
        getDistanceKey(bookingId)
    );

    return parseFloat(distance || 0);
};

const updateTripLocation = async (bookingId, latitude, longitude, distance) => {

    const currentDistance = await getTripDistance(bookingId);

    const totalDistance = currentDistance + distance;

    await redisClient.set(
        getDistanceKey(bookingId),
        totalDistance.toString()
    );

    await redisClient.set(
        getLastLocationKey(bookingId),
        JSON.stringify({
            latitude,
            longitude
        })
    );

    return totalDistance;
};
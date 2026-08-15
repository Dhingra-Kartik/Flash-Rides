const {redisClient} = require('../utils/redisClient');

const getDistanceKey = (bookingId) => `trip:${bookingId}:distance`;  //hey redis can you maintain distance

const getLastLocationKey = (bookingId) => `trip:${bookingId}:last_location`;  //hey, can you maintain last location i sent

const initializeTrip = async (bookingId, latitude, longitude) => {

    console.log(
        "1 = INITIALIZING TRIP:",
        bookingId,
        latitude,
        longitude
    );

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
    console.log(
        "1 = TRIP INITIALIZED"
    );
};

const getLastLocation = async (bookingId) => {

    console.log("Getting last location" );
    
    const location = await redisClient.get(
        getLastLocationKey(bookingId)
    );
    
    console.log("Getting last location", location);
    return location ? JSON.parse(location) : null;
};

const getTripDistance = async (bookingId) => {
    
    console.log("Getting trip distance");
    const distance = await redisClient.get(
        getDistanceKey(bookingId)
    );
    console.log("Getting trip distance", distance);
    
    const parsedDistance =
        parseFloat(distance);

    if (!Number.isFinite(parsedDistance)) {
        return 0;
    }

    return parsedDistance;
};

const updateTripLocation = async (bookingId, latitude, longitude, distance) => {
    console.log("UPDATE TRIP LOCATION");
    const currentDistance = await getTripDistance(bookingId);
    console.log("CURRENT DISTANCE: ",currentDistance);
    if (!Number.isFinite(distance)) {

        console.log(
            "INVALID SEGMENT DISTANCE:",
            distance
        );

        return currentDistance;
    }

    const safeCurrentDistance =
        Number.isFinite(currentDistance)
            ? currentDistance
            : 0;
    const totalDistance = currentDistance + distance;
    console.log(
        "CURRENT DISTANCE:",
        currentDistance, "Total distance: ", totalDistance
    );


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
    console.log("Getting TOTAL trip DITANCE", totalDistance);
    return totalDistance;
};

const clearTrip = async (bookingId) => {
    console.log("removed from redis", getDistanceKey(bookingId), getLastLocationKey(bookingId))
    await redisClient.del(
        getDistanceKey(bookingId),
        getLastLocationKey(bookingId)
    );
};

module.exports = {
    initializeTrip,
    getLastLocation,
    getTripDistance,
    updateTripLocation,
    clearTrip
};
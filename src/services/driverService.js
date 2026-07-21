//import the redis client the location services.
const locationService = require('./locationUpdate'); 
const passengerRepository = require('../repositories/passengerRepository');

const updateLocation = async(driverId, {latitude, longitude}) => {


    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    try {
        //update driver location to REDIS DB
        const res = await locationService.addDriverLOcation(driverId, lon, lat);
        //u can also update the same in mongoDB too
        await passengerRepository.updateLocation(driverId, {
            type: 'Point',
            coordinates: [lon, lat]
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    updateLocation
}
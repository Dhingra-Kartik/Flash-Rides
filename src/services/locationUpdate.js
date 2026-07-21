const {redisClient } = require('../utils/redisClient');

class locationService {
    async addDriverLOcation(driverId, longitude, latitude){
        try {
            const result = await redisClient.sendCommand([
                'GEOADD',
                'drivers',
                longitude.toString(),  //redis always expecte syou send long first then latitude
                latitude.toString(),
                driverId.toString()
            ]);
            console.log('Redis GEOADD result:', result);
            return result;


        console.log(`Driver ${driverId} location added`);
        } catch (error) {
            console.log("Cannot add driver location", error);
        
        }
    }
}

module.exports = new locationService();
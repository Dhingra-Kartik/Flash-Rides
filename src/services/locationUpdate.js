const {redisClient } = require('../utils/redisClient');

class locationService {
    async addDriverLocation(driverId, longitude, latitude){
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
            throw error;
        
        }
    }

    async findNearbyDrivers(lon, lat, rad){

        const nearbyDrivers = await redisClient.sendCommand([
            'GEORADIUS',
            'drivers',
            lon.toString(),
            lat.toString(),
            rad.toString(),
            'km',
            'WITHCOORD'
        ]);

        return nearbyDrivers;
    }

}

module.exports = new locationService();
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
        //found nearby drivers first
        const nearbyDrivers = await redisClient.sendCommand([
            'GEORADIUS',
            'drivers',
            lon.toString(),
            lat.toString(),
            rad.toString(),
            'km',
            'WITHCOORD'
        ]);
        console.log(nearbyDrivers);

        const availableDrivers = [];  //are teh nearby drivers we found available to take ride?

        for(const driver of nearbyDrivers){
            const driverId = driver[0];
            const status = await redisClient.hGet(
            'driver_availability',
            driverId
            );
            console.log(status);

            if(status == "available"){
                availableDrivers.push(driver);
            }

        }
        return availableDrivers;
    }

}

module.exports = new locationService();
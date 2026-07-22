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

    async setDriverSocket(driverId, socketId){
        await redisClient.set(`driver:${driverId}`, socketId);

    };
    async getDriverSocket(driverId){
        return await redisClient.get(`driver${driverId}`);
    };
    async deleteDriverSocket(driverId){
        await redisClient.del(`driver${driverId}`);

    };
    async deleteDriverSocket(socketId){
        deleteDriverSocket(redisClient.get(socketId));

    };

}

module.exports = new locationService();
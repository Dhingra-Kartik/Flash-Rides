const driverService = require('../services/driverService');

const updateLocation = async(req, res) => {
    
    try {
        const {latitude, longitude} = req.body;
        if(typeof(latitude)!= 'number' ||typeof(longitude)!= 'number' ){
            throw new Error("Enter VALID LAT & LONG !!");
        }

        const location = await driverService.updateLocation(req.user.id, {latitude, longitude});
        res.status(201).json({
            succes: true,
            message: "Location updated successfully",
            data: location
        })
        


    } catch (error) {
        console.log(error);
        res.status(400).send({error: error.message})
        
    }
}



module.exports = {
    updateLocation
}
const jwt = require('jsonwebtoken');   //required jsonwebtoken

const authMiddleware = (req, res, next) => {     //made a middleware 
    try {
        const authHeader = req.headers.authorization;   //let us get headers

        if (!authHeader) {      //are headers empty? if so return 
            return res.status(401).json({
                success: false,
                message: 'Authorization Header value cannot be missing'
            });
        }

        const token = authHeader.split(' ')[1];    //let us divid eteh header

        if (!token) {                  //if after split something is not there return 
            return res.status(401).json({
                success: false,
                message: 'Token cannot be missing'
            });
        }

        const decoded = jwt.verify(    //verify that token with JWT
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;
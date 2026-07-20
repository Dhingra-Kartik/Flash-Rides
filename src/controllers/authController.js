const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;  //destructuring of data in javascript

        const user = await authService.register({
            name,
            email,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { 
                userName: user.name,
                userEmail: user.email,
                userRole: user.role,
                    }, 
            });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async(req, res) =>{
    try {
        const {email, password} = req.body;

        const user = await authService.login({
            email,
            password
        })

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: user
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



module.exports = {
    register,
    login
};
const User = require('../models/userModel');  //our User Model out of User Schema

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });  //since we have destructure dthings so pass it inside {}
};

module.exports = {
    createUser,
    findUserByEmail
};
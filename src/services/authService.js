const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRepository = require('../repositories/authRepository');

const register = async (userData) => {
    const existingUser =
        await authRepository.findUserByEmail(userData.email);

    if (existingUser) {
        throw new Error('User already exists');
    }

    //let us have hashedPassword
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await authRepository.createUser({
        ...userData,
        password: hashedPassword
    });

    return user;
};

const login = async ({email, password}) => {   //same here since you have de-structured things, not taking all received from user so use { } to pass things
    const user =
        await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid =
        await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

    return {
        user,
        token
    };
};

module.exports = {
    register,
    login
}
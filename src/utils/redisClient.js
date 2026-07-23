const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});


redisClient.on('connect', () => {
    console.log('Redis connecting...');
});


redisClient.on('ready', () => {
    console.log('Redis connected and ready');
});


redisClient.on('error', (error) => {
    console.error('Redis error:', error);
});


redisClient.connect();


module.exports = {
    redisClient
};
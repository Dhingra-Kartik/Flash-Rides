const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.connect();

module.exports = {
    redisClient
};
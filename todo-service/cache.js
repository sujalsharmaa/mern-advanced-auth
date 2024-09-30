const redis = require('ioredis');
const { promisify } = require('util');
require('dotenv').config();

// Create Redis client
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Event listener for successful connection
client.on('connect', () => {
    console.log('Connected to Redis');
});

// Handle Redis errors
client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Promisify Redis methods for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Cache middleware function
async function cache(req, res, next) {
    const { id } = req.params;

    const cachedTodo = await getAsync(`todo:${id}`);

    if (cachedTodo) {
        return res.json(JSON.parse(cachedTodo));
    } else {
        next();
    }
}

module.exports = { client, getAsync, setAsync, cache };

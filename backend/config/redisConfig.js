// config/redisConfig.js
import redis from 'ioredis';
import dotenv from "dotenv"
dotenv.config()
import {promisify} from "util";
// Redis connection setup

const Redis = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    // Add retry strategies for production setups
    // retryStrategy(times) {
    //     return Math.min(times * 50, 2000); // exponential backoff
    // },
});

export const connectRedis = ()=>{
try {
    Redis.on('connect', () => {
        console.log('Connected to Redis');
    });
} catch (error) {
    console.log(`${error.message}`)
}
}
Redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});



export const getAsync = promisify(Redis.get).bind(Redis);
export const setAsync = promisify(Redis.set).bind(Redis);

export default Redis;

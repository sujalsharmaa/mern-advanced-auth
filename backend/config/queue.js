import Bull from 'bull'; // Import the entire Bull module
import redis from "./redisConfig.js"
// Create a new Bull queue
const signupQueue = new Bull('signupQueue', {
    createClient: () => redis, // Use your existing Redis client
});

// Optionally set up event listeners
signupQueue.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
});

signupQueue.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err.message}`);
});

export default signupQueue;

const Redis = require('ioredis');
const mongoose = require('mongoose');
const Todo = require('./models/Todo.js');  // Assuming you have a Mongoose Todo model
require('dotenv').config();

// Create Redis clients for producer and consumer
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
const redisQueue = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);

// Queue name for background tasks
const QUEUE_NAME = 'todo_queue';

// Function to add a task to the queue and wait for the result
async function addToQueue(task) {
    // Push the task onto the Redis queue
    await redis.lpush(QUEUE_NAME, JSON.stringify(task));

    // Wait for the task to be processed and return the new Todo
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const dbTodo = await Todo.findOne({ title: task.title });
            if (dbTodo) {
                clearInterval(interval);
                resolve(dbTodo);
            }
        }, 1); // Poll every 100ms
    });
}

// Consumer for the Redis queue
async function processQueue() {
    while (true) {
        try {
            // Fetch task from the queue
            const task = await redisQueue.rpop(QUEUE_NAME);

            if (task) {
                const parsedTask = JSON.parse(task);
                console.log('Processing task:', parsedTask);

                // Create and save the new Todo
                const newTodo = new Todo({
                    title: parsedTask.title,
                    description: parsedTask.description,
                    user: parsedTask.user
                });
                await newTodo.save();
                console.log('Task saved to MongoDB:', newTodo);
            } else {
                // No task found, optional delay to avoid busy-looping
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        } catch (err) {
            console.error('Error processing task:', err);
        }
    }
}

// Start processing the queue in the background
processQueue().catch(console.error);

module.exports = { addToQueue };

const express = require('express');
const Todo = require('../models/Todo');
const { cache, setAsync } = require('../cache');
const { addToQueue } = require('../queue');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')

let resp;
// Get all todos
router.get('/', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get a specific todo by ID, using cache
router.get('/:id', verifyToken, cache, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        // Store the result in Redis cache
        await setAsync(`todo:${req.params.id}`, JSON.stringify(todo), 'EX', 60 * 10); // Cache for 10 minutes
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create a new todo and add it to Redis queue for processing
router.post('/', verifyToken, async (req, res) => {
    const { title } = req.body;
    console.log("req =>", req.body)

    const newTodo = {
        title,
        user: req.userId
    };

    // Add task to Redis queue for background processing
    const resQueue = await addToQueue(newTodo);
    try {
        if (resQueue) {
            resp = await Todo.find({ title: title });
        }
    
        // Check if the todo was found
        if (!resp) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Send the response with the found todo
        console.log("resp=>",resp)
        res.status(202).json({ "newTodo": resp[0] });
    } catch (err) {
        console.error('Error fetching the todo:', err);
        res.status(500).json({ error: 'Server Error' });
    }

});

// Update an existing todo
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { title, completed } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { title, completed }, { new: true });

        if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });

        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete a todo
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

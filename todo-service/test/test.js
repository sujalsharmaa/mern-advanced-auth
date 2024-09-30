const axios = require('axios');
const fs = require('fs');
const path = require('path');
// import axios from "axios";
// import fs from "fs";
// import path from "path";

// Function to perform the load test
async function loadTestSignup() {
    // Load the todo data from todos.json
    const todosFilePath = path.join("./", 'todoMock.json');
    const todosData = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));

    console.log(`Starting load test with ${todosData.length-990} todos...`);

    const requests = todosData.map(async (todo) => {
        try {
            const response = await axios.post('http://localhost:5001/todos/', todo);
            console.log(`todo ${todo.todo} signed up successfully with status: ${response.status}`);
        } catch (error) {
            if (error.response) {
                // The server responded with a status other than 2xx
                console.error(`Error for todo ${todo.todo}: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(`No response received for todo ${todo.todo}`);
            } else {
                // Something happened in setting up the request
                console.error(`Error setting up request for todo ${todo.todo}:`, error.message);
            }
        }
    });

    // Wait for all requests to complete
    await Promise.all(requests);

    console.log('Load test completed.');
}

// Call the function to start the load test
loadTestSignup();

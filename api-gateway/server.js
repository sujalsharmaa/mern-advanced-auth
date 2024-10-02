const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Configure CORS to allow requests from the frontend service
app.use(cors({
    origin: CLIENT_URL, // Explicitly allow your frontend origin
    credentials: true // Allow credentials (cookies, sessions)
}));

app.use(express.json({ limit: '50mb' }));

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';
const TODO_SERVICE_URL = process.env.TODOS_SERVICE_URL || 'http://localhost:5001';// Replace with your todo service URL

app.get('/',(req,res)=>{
    res.send('it works')
})

app.use('/api/auth', proxy(AUTH_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        return proxyResData;
    },
}));

app.use('/todos', proxy(TODO_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        return proxyResData;
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
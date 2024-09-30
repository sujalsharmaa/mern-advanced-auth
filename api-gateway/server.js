const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;
app.use(cors({
    origin: 'http://localhost:5173',  // Explicitly allow your frontend origin
    credentials: true                 // Allow credentials (cookies, sessions)
}));
app.use(express.json({ limit: '50mb' }));

const AUTH_SERVICE_URL = 'http://localhost:5000'; // Replace with your auth service URL
const TODO_SERVICE_URL = 'http://localhost:5001'; // Replace with your todo service URL

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
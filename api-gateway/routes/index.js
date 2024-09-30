const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// app.use(cors({
//     origin: 'http://localhost:5173', // Only allow requests from this origin
//        // Define allowed HTTP methods
//                     // If you are using credentials (cookies, etc.)
// }));
// Auth service proxy
router.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL, // Proxy to Auth service
    changeOrigin: true,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    pathRewrite: {
        '^/auth': '', // Remove `/auth` prefix when sending to Auth service
    }
}));

router.use('/todo', createProxyMiddleware({
    target: process.env.TODO_SERVICE_URL,
    changeOrigin: true,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    pathRewrite: {
        '^/todo': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to Todo service:', req.url);
    },
    onError: (err, req, res) => {
        console.error('Error in proxy:', err);
        res.status(500).send('Something went wrong.');
    },
}));


module.exports = router;

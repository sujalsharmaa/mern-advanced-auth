const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    // Get the token from cookies or headers
    const token = req.cookies.token || req.headers['authorization'];
    //console.log("token =>",token)
        // Check if token is present
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }
            console.log("User =>",req.user)
        //console.log("decoded id =>", decoded)
        // Attach userId to the request object
        req.userId = decoded.userId; // Setting decoded user ID to req.user

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.log("Error in verifyToken:", error.message);
        return res.status(500).json({ success: false, message: "Server error - token verification failed" });
    }
};

module.exports = verifyToken;

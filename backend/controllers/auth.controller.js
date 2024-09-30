// import bcryptjs from "bcryptjs";
// import crypto from "crypto";

// import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import {
// 	sendPasswordResetEmail,
// 	sendResetSuccessEmail,
// 	sendVerificationEmail,
// 	sendWelcomeEmail,
// } from "../mailtrap/emails.js";
// import { User } from "../models/user.model.js";

// export const signup = async (req, res) => {
// 	const { email, password, name } = req.body;

// 	try {
// 		if (!email || !password || !name) {
// 			throw new Error("All fields are required");
// 		}

// 		const userAlreadyExists = await User.findOne({ email });
// 		console.log("userAlreadyExists", userAlreadyExists);

// 		if (userAlreadyExists) {
// 			return res.status(400).json({ success: false, message: "User already exists" });
// 		}

// 		const hashedPassword = await bcryptjs.hash(password, 10);
// 		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

// 		const user = new User({
// 			email,
// 			password: hashedPassword,
// 			name,
// 			verificationToken,
// 			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
// 		});

// 		await user.save();

// 		// jwt
// 		generateTokenAndSetCookie(res, user._id);

// 		await sendVerificationEmail(user.email, verificationToken);

// 		res.status(201).json({
// 			success: true,
// 			message: "User created successfully",
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const verifyEmail = async (req, res) => {
// 	const { code } = req.body;
// 	try {
// 		const user = await User.findOne({
// 			verificationToken: code,
// 			verificationTokenExpiresAt: { $gt: Date.now() },
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
// 		}

// 		user.isVerified = true;
// 		user.verificationToken = undefined;
// 		user.verificationTokenExpiresAt = undefined;
// 		await user.save();

// 		await sendWelcomeEmail(user.email, user.name);

// 		res.status(200).json({
// 			success: true,
// 			message: "Email verified successfully",
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		console.log("error in verifyEmail ", error);
// 		res.status(500).json({ success: false, message: "Server error" });
// 	}
// };

// export const login = async (req, res) => {
// 	const { email, password } = req.body;
// 	try {
// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid credentials" });
// 		}
// 		const isPasswordValid = await bcryptjs.compare(password, user.password);
// 		if (!isPasswordValid) {
// 			return res.status(400).json({ success: false, message: "Invalid credentials" });
// 		}

// 		generateTokenAndSetCookie(res, user._id);

// 		user.lastLogin = new Date();
// 		await user.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "Logged in successfully",
// 			user: {
// 				...user._doc,
// 				password: undefined,
// 			},
// 		});
// 	} catch (error) {
// 		console.log("Error in login ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const logout = async (req, res) => {
// 	res.clearCookie("token");
// 	res.status(200).json({ success: true, message: "Logged out successfully" });
// };

// export const forgotPassword = async (req, res) => {
// 	const { email } = req.body;
// 	try {
// 		const user = await User.findOne({ email });

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "User not found" });
// 		}
// 		// Generate reset token
// 		const resetToken = crypto.randomBytes(20).toString("hex");
// 		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

// 		user.resetPasswordToken = resetToken;
// 		user.resetPasswordExpiresAt = resetTokenExpiresAt;
// 		await user.save();
// 		// send email
// 		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
// 		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
// 	} catch (error) {
// 		console.log("Error in forgotPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const resetPassword = async (req, res) => {
// 	try {
// 		const { token } = req.params;
// 		const { password } = req.body;
// 		const user = await User.findOne({
// 			resetPasswordToken: token,
// 			resetPasswordExpiresAt: { $gt: Date.now() },
// 		});
// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
// 		}
// 		// update password
// 		const hashedPassword = await bcryptjs.hash(password, 10);

// 		user.password = hashedPassword;
// 		user.resetPasswordToken = undefined;
// 		user.resetPasswordExpiresAt = undefined;
// 		await user.save();

// 		await sendResetSuccessEmail(user.email);

// 		res.status(200).json({ success: true, message: "Password reset successful" });
// 	} catch (error) {
// 		console.log("Error in resetPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const checkAuth = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.userId).select("-password");
// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "User not found" });
// 		}

// 		res.status(200).json({ success: true, user });
// 	} catch (error) {
// 		console.log("Error in checkAuth ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

///////////////////////////////////////////////////////////////////////

import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { getAsync,setAsync } from "../config/redisConfig.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/normalEmail.js";
import {User} from "../models/user.model.js"
import Redis from '../config/redisConfig.js'; // Redis setup
import signupQueue from '../config/queue.js'; // Adjust the path as necessary


export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields (email, password, name) are required");
		}

		// Check Redis cache first
		const cachedUser = await Redis.get(`user:${email}`);
		if (cachedUser) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		// Add the user to the signup queue
		const userAlreadyExist = await User.findOne({ email });
		if (userAlreadyExist) {
			throw new Error("User already exists");
		}

		// Hash password
		const hashedPassword = await bcryptjs.hash(password, 10);

		// Generate verification token
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		// Create new user
		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
		});

		await user.save();

		// Send verification email
		await sendVerificationEmail(user.email, verificationToken);

		// Store the user in Redis for caching (TTL for cache)
		await setAsync(`user:${email}`, JSON.stringify({ email }), 'EX', 24 * 60 * 60);
				res.status(201).json({
			success: true,
			message: "User signup in progress. Please check your email for verification.",
		});

	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
		console.log(error);
	}
};


export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: Number(code),
			verificationTokenExpiresAt: { $gt: Date.now() }
		});
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		// Mark the user as verified
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		// Update the cached user in Redis
		await Redis.set(`user:${user.email}`, JSON.stringify(user), 'EX', 24 * 60 * 60);

		// Send welcome email
		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
		console.log("Error in verify Email =>", error);
	}
};




export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user data exists in Redis cache
		let cachedUser = await getAsync(email);

		let user;
		if (cachedUser) {
			// Parse the cached user
			const parsedUser = JSON.parse(cachedUser);
			// Find the user in the database using the email
			user = await User.findById(parsedUser._id); // Fetch from DB to ensure it's a Mongoose document
		} else {
			// If user is not found in Redis, query the database
			user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ success: false, message: "Invalid credentials" });
			}

			// Cache the user data in Redis for future logins (optional expiration time, e.g., 1 hour)
			await setAsync(email, JSON.stringify(user), 'EX', 3600);
		}

		// Check if password is valid
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// Generate token and set cookie
		generateTokenAndSetCookie(res, user._id);

		// Update last login time and save the user data
		user.lastLogin = new Date();
		await user.save(); // Save the existing Mongoose document

		// Update cached user data in Redis with the new lastLogin
		await setAsync(email, JSON.stringify(user), 'EX', 3600);

		// Respond with user data, excluding the password
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;
		await user.save();
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
		res.status(200).json({ success: true, message: "Password reset link sent to your email" });


	} catch (error) {
		console.log(error)
	}
}

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() }
		});
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
		}
		//const SALT = bcryptjs.genSaltSync(10);
		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();
		await sendResetSuccessEmail(user.email);
		res.status(200).json({ success: true, message: "password reset successful" });


	} catch (error) {
		console.log("Error in resetPassword", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth", error);
		res.status(400).json({ success: false, message: error.message })
	}
}






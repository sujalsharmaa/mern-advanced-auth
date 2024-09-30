import signupQueue from './queue.js'; // Adjust the path as necessary
import User from '../models/user.model.js'; // Ensure you have the correct path to your User model
import bcryptjs from 'bcryptjs';
import sendVerificationEmail from '../mailtrap/emails.js'; // Adjust the path as necessary

signupQueue.process(async (job) => {
    const { email, password, name } = job.data;

    // Check if the user already exists in MongoDB
    console.log("job data ->", email,password,name)
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
});

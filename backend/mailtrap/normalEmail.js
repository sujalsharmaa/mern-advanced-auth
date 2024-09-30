import dotenv from "dotenv";
dotenv.config(); // Ensure this loads .env variables

import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { nodemailerClient } from "./mailtrap.config.js"; // or whatever file your nodemailerClient is in

// Function to send a verification email
export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const result = await nodemailerClient.sendMail({
            from: process.env.MY_EMAIL, // Sender email from env variable
            to: email, // Recipient's email (as a string)
            subject: "Verify your email", // Email subject
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // HTML body
            headers: {
                'X-Category': 'Email Verification', // Custom header (category)
            },
        });

        console.log('Email sent:', result);
    } catch (error) {
        console.log("Error:=> ", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {

    try {
        const response = await nodemailerClient.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Welcome to Auth Company",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
        })
        console.log("Welcome email send successfully", response)
    } catch (error) {

        console.log(error)
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await nodemailerClient.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)

        })
        console.log("Welcome email send successfully", response)
    } catch (error) {
        console.log(error)
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await nodemailerClient.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"

        })
        console.log("Welcome email send successfully", response)
    } catch (error) {
        console.log(error)
    }
}


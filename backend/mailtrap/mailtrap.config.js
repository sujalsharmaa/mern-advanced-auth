import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config()

export const nodemailerClient = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MY_EMAIL,
		pass: process.env.MY_PASSWORD
	}
});


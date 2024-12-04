import path from "path";
import { fileURLToPath } from 'url';
import handlebars from "handlebars";
import fs from "fs";
import nodemailer from "nodemailer";
import generateOTP from "./generateOtp.js";
import res from "express/lib/response.js";

async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "emailer.otp.generate@gmail.com",
            pass: process.env.APP_PASSCODE,
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        }
    });

    const verifyTransporter = () => {
        return new Promise((resolve, reject) => {
            transporter.verify((error, success) => {
                if (error) {
                    console.log("Error in connecting to transporter:", error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });
    };

    const sendMail = (otp, htmlToSend) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: "emailer.otp.generate@gmail.com",
                to: email,
                subject: "OTP for login/signup to e-commerce",
                text: `Here is your OTP for email verification: ${otp}`,
                html: htmlToSend,
            }).then(() => {
                console.log(`OTP sent: ${otp}`);
                resolve();
            }).catch((error) => {
                console.log("OTP not sent:", error);
                reject(error);
            });
        });
    };

    try {
        await verifyTransporter();
        const otp = generateOTP();
        console.log(otp);

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.resolve(__dirname, "../public/emailTemplate.html"); // Using path.resolve
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = { OTP_CODE: otp };
        const htmlToSend = template(replacements);

        await sendMail(otp, htmlToSend);
        return;
    } catch (error) {
        console.error("Failed to send email:", error);
        return;
    }
}

export default sendEmail;
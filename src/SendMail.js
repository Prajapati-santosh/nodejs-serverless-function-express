import path from "path";
import handlebars from "handlebars";
import fs from "fs";
import nodemailer from "nodemailer";
import generateOTP from "./generateOtp.js";



const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
    user: "emailer.otp.generate@gmail.com",
    pass: process.env.APP_PASSCODE,
  },
})

await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});

async function sendEmail(email){
    

await new Promise((resolve, reject) => {
    // send mail
    const otp=generateOTP();
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "./public/emailTemplate.html");
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
        OTP_CODE: otp
      };
    const htmlToSend = template(replacements);
    transporter.sendMail({
        from:"emailer.otp.generate@gmail.com",
        to:email,
        subject:"OTP for login/signup to e-commerce",
        text: `Here is you otp for email verification ${otp}`,
        html:htmlToSend
    });
})
    return "OTP generation failed";
}

export default sendEmail;

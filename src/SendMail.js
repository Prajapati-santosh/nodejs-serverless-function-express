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

async function sendEmail(email){
    const otp=generateOTP();
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "./public/emailTemplate.html");
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
        OTP_CODE: otp
      };
    const htmlToSend = template(replacements);
    await transporter.sendMail({
        from:"emailer.otp.generate@gmail.com",
        to:email,
        subject:"OTP for login/signup to e-commerce",
        text: `Here is you otp for email verification ${otp}`,
        html:htmlToSend
    }).then(()=>{
        console.log("otp sent");
    }).catch((error)=>{
        console.log("otp not sent");
})
    return "OTP generation failed";
}

export default sendEmail;

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
    await transporter.sendMail({
        from:"emailer.otp.generate@gmail.com",
        to:email,
        subject:"OTP for login/signup to e-commerce",
        text: `Here is you otp for email verification ${otp}`,
    }).then(()=>{
        console.log("otp sent");
    }).catch((error)=>{
        console.log("otp not sent");
})
    return "OTP generation failed";
}

export default sendEmail;

import transporter from "../config/nodemailer.js";
import { config } from "dotenv";
import tokenHandler from "../helpers/tokenHandler.js";
config();

export default function sendEmail(receiver, emailType){
        
        const token = tokenHandler.signToken({ userId: receiver._id }, process.env.JWT_SECRET_KEY, '10m');

        const verifyEmailTemplate = `
            <h1>Welcome to Marhaba Livraison!</h1>
            <p>Please click the following link to verify your email address:</p>
            <a href="http://localhost:3000/verify?token=${token}">Verify Email</a>
            <p>This Link is valid only for 10 minutes</p>
        `
        const resetPassEmailTemplate = `
            <h1>Reset Your Password</h1>
            <p>Please click the following link to reset your password:</p>
            <a href="http://localhost:3000/reset/${token}">Reset Your Password</a>
            <p>This Link is valid only for 10 minutes</p>
        `

        const mailOptions = {
            from : `${process.env.APP_NAME} <${process.env.USER}>`,
            to : receiver.email,
            subject : emailType === 'verification' ? 'Verification email' : 'Reset Password email',
            html: emailType === 'verification' ? verifyEmailTemplate : resetPassEmailTemplate
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                throw new Error(error.message)
            }
        })

    }
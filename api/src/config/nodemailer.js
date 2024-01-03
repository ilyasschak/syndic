import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();
const service = process.env.MAIL_SERVICE;
const user = process.env.USER;
const pass = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    service : service,
    auth : {
        user : user,
        pass : pass
    }
});

export default transporter;
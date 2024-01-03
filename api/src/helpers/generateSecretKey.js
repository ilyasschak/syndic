import crypto from 'crypto'
import fs from 'fs';

const secretKey = crypto.randomBytes(32).toString('hex');
const envPath = './.env';

export default function generateJwtSecretKeyInEnvFile(){

    if(fs.existsSync(envPath)){

        const existingEnv = fs.readFileSync(envPath, 'utf-8');
    
        if(existingEnv.includes('JWT_SECRET_KEY')){
            return;
        }else{
            fs.appendFileSync(envPath, `JWT_SECRET_KEY = ${secretKey}`);
            console.log('.env file updated with JWT secret key')
        }
    
    }else{
        fs.writeFileSync(envPath, `JWT_SECRET_KEY = ${secretKey}`);
        console.log('.env file created with JWT secret key')
    }
}
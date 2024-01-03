import jwt  from "jsonwebtoken";
const {sign, verify} = jwt;

export default class tokenHandler{
    
    static signToken(data, secret_key, life_duration){
        try {

            const token = sign(data, secret_key, {
              algorithm: 'HS256',
              expiresIn: life_duration,
            });

            return token;

        } catch (error) {
            throw new Error(`Error while signing the token: ${error.message}`);
        }
    }

    static async verifyToken(token, secret_key){
        return new Promise((resolve, reject)=>{
            verify(token, secret_key, (err, decoded) => {
                if (err) {
                    reject(new Error('Invalid or expired token.'));
                } else {
                    resolve(decoded);
                }
            })    

        })
    }
}
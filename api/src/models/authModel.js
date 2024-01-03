import { userModel } from "./config/models.js";

export default class AuthModel{

    constructor(name, image, email, password, phoneNumber, address, role) {
        this.name = name;
        this.image = image;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
    }

    async register(){
        const user = await userModel.create({
            name : this.name,
            image : this.image,
            email : this.email,
            password : this.password,
            phoneNumber : this.phoneNumber,
            address : this.address,
            role : this.role,
            isVerified : false
        })

        return user;    
    }

    static async getUser(id){
        const user = await userModel.findOne({ _id: id }).populate('role');
        return user;
    }

    static async getUserByEmail(email){
        const user = await userModel.findOne({email : email}).populate('role');
        return user;
    }
}
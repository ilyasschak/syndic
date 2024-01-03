import bcryptjs from 'bcryptjs';
import RoleModel from "../models/roleModel";
import validation from '../validations/authValidation';
import AuthController from '../controllers/authController';
import AuthModel from '../models/authModel'; 
import { jest } from '@jest/globals';

jest.mock('../validations/authValidation');

jest.spyOn(bcryptjs, 'hash').mockResolvedValue('mockedHashedPassword');

jest.spyOn(RoleModel, 'getRoleId').mockReturnValue('mockedRoleId');

const res = {
    status : jest.fn().mockReturnThis(),
    json : jest.fn(),
}

describe("Register User Functionality Testing", () => {    
    
    it("Should return status 200 after the register successfully", async () => {
        const req = {
            body : {
                _id : 1,
                name : "ayoub el ayouk",
                email : "ayoubelayouk@gmail.com", 
                password : "abcd1234", 
                phoneNumber : "0678129024", 
                address : "the address", 
                role : "client"
            },
            file : {
                filename : "photo.png"
            },
            cookies : {}
        }

        const mockRegisteredUser = req.body;
    
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(null);
        
        jest.spyOn(AuthModel.prototype, 'register').mockResolvedValue(mockRegisteredUser);
    
        await AuthController.register(req, res);
    
        // expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success : "Registered successfully, Check your inbox for verification email"
        });
    });

    it("Should return status 400 when email already exist", async()=>{
        const req = {
            body : {
                _id : 1,
                name : "ayoub el ayouk",
                email : "ayoubelayouk@gmail.com", 
                password : "abcd1234", 
                phoneNumber : "0678129024", 
                address : "the address", 
                role : "client"
            },
            file : {
                filename : "photo.png"
            },
            cookies : {}
        }
        
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(req.body);


        await AuthController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Email address is already in use.",
        });

    });

    it("Should return status 400 when not providing the password", async () => {
        const req = {
          body: {
            _id: 1,
            name: "ayoub el ayouk",
            email: "ayoubelayouk@gmail.com",
            password: "",
            phoneNumber: "0678129024",
            address: "the address",
            role: "client",
          },
          file: {
            filename: "photo.png",
          },
          cookies: {},
        };
      
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(null);
      
        jest.spyOn(AuthModel.prototype, 'register').mockResolvedValue(req.body);
      
        await AuthController.register(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "\"password\" is not allowed to be empty",
        });
    });
      
})
import AuthController from '../controllers/authController';
import AuthModel from '../models/authModel';
import bcryptjs from 'bcryptjs'
import tokenHandler from '../helpers/tokenHandler';
import AuthValidation from '../validations/authValidation';
import { jest } from '@jest/globals';

jest.mock('../validations/authValidation');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  cookie: jest.fn(),
  send : jest.fn().mockReturnThis()
};

const req = {
  cookies: {},
  body: {
    email: 'ayoubelayouk1@gmail.com',
    password: 'testPassword1234',
  },
};

describe('AuthController login', () => {
    it('should return status 200 when login is successful', async () => {
        const mockUser = {
        _id: 'someUserId',
        email: 'ayoubelayouk1@gmail.com',
        password: 'hashedPassword',
        isVerified: true,
        role: {
            title: 'client',
        },
        };
        
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(mockUser);

        jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true);
        
        jest.spyOn(tokenHandler, 'signToken').mockReturnValueOnce('someToken');

        await AuthController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockUser);

        expect(res.cookie).toHaveBeenCalledWith('token', 'someToken', {
            sameSite: 'none',
            secure: true,
        });
    });

    it('should return status 400 for Incorrect password', async () => {
        const mockUser = {
          _id: 'someUserId',
          email: 'ayoubelayouk1@gmail.com',
          password: 'hashedPassword',
          isVerified: true,
          role: {
            title: 'client',
          },
        };
    
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(mockUser);
        jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false);
        
        await AuthController.login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Incorrect password',
        });
    });

    it('should return status 400 for Email not found', async () => {
        jest.spyOn(AuthModel, 'getUserByEmail').mockResolvedValue(null); // Simulate email not found
        
        await AuthController.login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Email not found',
        });
    });
});

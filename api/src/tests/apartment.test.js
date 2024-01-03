import ApartmentController from '../controllers/apartmentController';
import ApartmentModel from '../models/apartmentModel';
import ClientModel from '../models/clientModel';
import { clientModel } from '../models/config/models';
import validation from '../validations/apartmentValidation';
import errorHandler from '../validations/validationsErrorHandler';
import { jest } from '@jest/globals';
import { Types } from 'mongoose';


jest.mock('../validations/apartmentValidation');
jest.mock('../validations/validationsErrorHandler');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req = {
  body: {},
};

describe('ApartmentController insertApartment', () => {
    
    it('should update client residency and insert apartment for existing client', async () => {
        req.body = {
          number: 103,
          building: 1,
          currentClient: new Types.ObjectId(),
          status: 'available',
        };
    
        const mockClientFindOneAndUpdate = jest.spyOn(clientModel, 'findOneAndUpdate');
        mockClientFindOneAndUpdate.mockResolvedValueOnce({ _id: 'existingClientId', isReside: false });
    
        const mockApartmentInsert = jest.spyOn(ApartmentModel, 'Insert');
        mockApartmentInsert.mockResolvedValueOnce({});
    
        await ApartmentController.insertApartment(req, res);
    
        expect(mockClientFindOneAndUpdate).toHaveBeenCalledWith(
          { _id: req.body.currentClient, isReside: false },
          { $set: { isReside: true } },
        );
    
        expect(mockApartmentInsert).toHaveBeenCalledWith({
          number: 103,
          building: 1,
          currentClient: req.body.currentClient,
          status: 'available',
        });
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: 'Apartment Successfully Added!',
        });
    });
    
    it('should insert apartment for new client and return status 201', async () => {
        req.body = {
        number: 102,
        building: 2,
        currentClient: 'addNew',
        fullName: 'John Doe',
        cin: 'N123123',
        status: 'occupied',
        };

        jest.spyOn(clientModel, 'findOne').mockResolvedValue(null);

        jest.spyOn(ClientModel, 'Insert').mockResolvedValueOnce({ _id: 'newClientId' });

        jest.spyOn(ApartmentModel, 'Insert').mockResolvedValueOnce({});

        await ApartmentController.insertApartment(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
        success: 'Apartment Successfully Added!',
        });
    });

    it('should handle existing client with same CIN and return status 400', async () => {
        req.body = {
            number: 104,
            building: 4,
            currentClient: 'addNew',
            fullName: 'John Doe',
            cin: 'N123123',
            status: 'occupied',
        };

        jest.spyOn(clientModel, 'findOne').mockResolvedValueOnce(req.body);

        await ApartmentController.insertApartment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'cin already exist',
        });
    });

    it('should insert apartment without associating with any client and return status 201', async () => {
        req.body = {
            number: 105,
            building: 5,
            currentClient: '',
            status: 'available',
        };

        jest.spyOn(ApartmentModel, 'Insert').mockResolvedValueOnce({});

        await ApartmentController.insertApartment(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: 'Apartment Successfully Added!',
        });
    });

    it('should handle validation error ("number" must be number) and return status 400', async () => {
        req.body = {
            number: "",
            building: 3,
            currentClient: new Types.ObjectId(),
            status: 'available',
        };

        await ApartmentController.insertApartment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: '\"number\" must be a number',
        });
    });

});

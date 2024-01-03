import ClientController from '../controllers/clientController';
import ClientModel from '../models/clientModel';
import { apartmentModel } from '../models/config/models';
import {Types} from "mongoose"
import { jest } from '@jest/globals';


jest.mock('../models/clientModel');
jest.mock('../models/config/models');
jest.mock('../validations/clientValidation');
jest.mock('../validations/validationsErrorHandler');

const res = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req = {
  params: { id: new Types.ObjectId() },
  body: {
    _id : new Types.ObjectId(),
    fullName : "ayoub",
    cin : "n123456"
  },
};

describe('ClientController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getClients', () => {
    it('should return clients', async () => {
      const mockClients = [{ _id: new Types.ObjectId(), name: 'Client 1' }, { _id: new Types.ObjectId(), name: 'Client 2' }];
      jest.spyOn(ClientModel, 'GetAll').mockResolvedValueOnce(mockClients);

      await ClientController.getClients(req, res);

      expect(res.send).toHaveBeenCalledWith(mockClients);
    });

    it('should handle error and return status 400', async () => {
      jest.spyOn(ClientModel, 'GetAll').mockRejectedValueOnce('Some error');

      await ClientController.getClients(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });

  describe('deleteClient', () => {
    it('should update apartments and delete client', async () => {
      jest.spyOn(apartmentModel, 'updateMany').mockResolvedValueOnce({});
      jest.spyOn(ClientModel, 'Delete').mockResolvedValueOnce();

      await ClientController.deleteClient(req, res);

      expect(apartmentModel.updateMany).toHaveBeenCalledWith({ currentClient: req.params.id }, { $set: { currentClient: null } });
      expect(ClientModel.Delete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: 'Client deleted successfully !' });
    });

    it('should handle error and return status 400', async () => {
      jest.spyOn(apartmentModel, 'updateMany').mockRejectedValueOnce('Some error');
      jest.spyOn(ClientModel, 'Delete').mockResolvedValueOnce();

      await ClientController.deleteClient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });

  describe('updateClient', () => {
    it('should update client and return status 200', async () => {
      jest.spyOn(ClientModel, 'Update').mockResolvedValueOnce();

      await ClientController.updateClient(req, res);

      expect(ClientModel.Update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: 'Client updated successfully !' });
    });

    it('should handle validation error and return status 400', async () => {
      await ClientController.updateClient({
        body: {
            _id : new Types.ObjectId(),
            fullName : "",
            cin : "n123456"
        }
      }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Full name cannot be empty' });
    });

    it('should handle error in client update and return status 400', async () => {
      jest.spyOn(ClientModel, 'Update').mockRejectedValueOnce('Some error');

      await ClientController.updateClient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });
});

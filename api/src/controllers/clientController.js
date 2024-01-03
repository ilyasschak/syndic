import ClientModel from "../models/clientModel.js";
import { apartmentModel } from "../models/config/models.js";
import validateClient from "../validations/clientValidation.js";
import errorHandler from "../validations/validationsErrorHandler.js";

export default class ClientController{
    
    static async getClients(req, res){
        try{
            res.send(await ClientModel.GetAll());
        }catch(error){
            res.status(400).json({error : error})
        }
    }

    static async deleteClient(req, res){
        try{
            await apartmentModel.updateMany({ currentClient: req.params.id }, { $set: { currentClient: null } })
            await ClientModel.Delete(req.params.id);
            res.status(200).json({ success : "Client deleted successfully !"})
        }catch(error){
            res.status(400).json({ error : error})
        }
    }

    static async updateClient(req, res){
        try{
            const {error} = validateClient(req);
            error ? errorHandler(error) : "";
            await ClientModel.Update(req.body)
            res.status(200).json({ success : "Client updated successfully !"});
        }catch(error){
            res.status(400).json({error : error});
        }
    }
}
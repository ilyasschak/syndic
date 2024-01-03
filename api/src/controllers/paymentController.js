import { apartmentModel, paymentModel } from "../models/config/models.js";
import PaymentModel from "../models/paymentModel.js";
import validatePayment from "../validations/paymentValidation.js";
import errorHandler from "../validations/validationsErrorHandler.js";

export default class paymentController{
    static async insertPayment(req, res){
        
        try{
            
            let {month, amount, paymentMethod, apartment} = req.body;
            
            const { error } = validatePayment(req);

            error ? errorHandler(error) : "";

            const apartmentResult = await apartmentModel.findById(apartment).select("currentClient");
    
            if(apartmentResult){
                const payment = {apartment, currentClient: apartmentResult.currentClient, month, amount, paymentMethod };
                await PaymentModel.Insert(payment);
            }
    
            res.status(201).json({success : "Payment Inserted Successfully"});

        }catch(error){
            res.status(400).json({error : error})
        }
    }

    static async getApartmentPayments(req, res){
        try{
            res.status(200).json(await PaymentModel.GetByApartment(req.params.id))
        }catch(error){
            res.status(400).json({error : error})
        }
    }

    static async getPayments(req, res){
        try{
            res.status(200).json(await PaymentModel.GetAll());
        }catch(error){
            res.status(400).json({error : error});
        }
    }

    static async deletePayment(req, res){
        try{
            await PaymentModel.Delete(req.params.id);
            res.status(200).json({ success : "Payment deleted successfully !"})
        }catch(error){
            res.status(400).json({error : error})
        }
    }

    static async getPayment(req, res){
        try{
            res.status(200).json(await PaymentModel.GetOne(req.params.id));
        }catch(error){
            res.status(400).json({error : error});
        }
    }

    static async updatePayment(req, res){
        try{
            const { error } = validatePayment(req);
            error ? errorHandler(error) : "";

            const {amount, month, paymentMethod, _id} = req.body;
            const payment = {amount, month, paymentMethod, _id};
            await PaymentModel.Update(payment);
            
            res.status(200).json({success : "Payment updated successfully"})
        }catch(error){
            res.status(400).json({error : error})
        }
    }
}
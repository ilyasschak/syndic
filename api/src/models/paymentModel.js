import { paymentModel } from "./config/models.js";

export default class PaymentModel{

    static async Insert(payment_data){
        const {apartment, currentClient, month, amount, paymentMethod} = payment_data;
        
        const payment = await paymentModel.create({
            apartmentID: apartment,
            clientID : currentClient,
            month: month,
            amount: amount,
            paymentMethod: paymentMethod,
        })

        return payment;    
    }

    static async GetByApartment(apartment_id){
        const payments = await paymentModel.find({apartmentID : apartment_id});
        return payments
    }    
    
    static async GetAll(){
        const payments = await paymentModel.find({}).populate("apartmentID clientID");
        return payments
    }

    static async GetOne(id){
        const payment = await paymentModel.findById(id).populate("apartmentID clientID");
        return payment
    }

    static async Update(payment_data){
        const payment = await paymentModel.findByIdAndUpdate(payment_data._id, payment_data);
        return payment
    }

    static async Delete(id){
        const payment = await paymentModel.findByIdAndDelete(id);
        return payment;
    }
}
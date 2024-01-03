import { apartmentModel } from "./config/models.js";

export default class ApartmentModel{

    static async Insert(apartment_data){
        const {number, building, currentClient, status} = apartment_data;
        
        const apartment = await apartmentModel.create({
            number : number,
            building : building,
            currentClient : currentClient,
            status : status,
            isDeleted : false,
        })

        return apartment;    
    }

    static async GetAll(){
        const apartments = await apartmentModel.find({}).populate('currentClient');
        return apartments
    }

    static async GetOne(id){
        const apartment = await apartmentModel.findById(id);
        return apartment
    }

    static async Update(apartment_data){
        const apartment = await apartmentModel.findByIdAndUpdate(apartment_data._id, apartment_data);
        return apartment;
    }

    static async Delete(id){
        const apartment = await apartmentModel.findByIdAndUpdate(id, {isDeleted : true});
        return apartment;
    }
}
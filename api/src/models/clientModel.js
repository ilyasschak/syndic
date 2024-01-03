import { clientModel } from "./config/models.js";

export default class ClientModel{

    static async Insert(client_data){
        
        const {fullName, cin} = client_data

        const client = await clientModel.create({
            fullName : fullName,
            cin : cin,
            isReside : true,
            isDeleted : false
        })

        return client;    
    }

    static async GetAll(){
        const clients = await clientModel.find({});
        return clients
    }

    static async Delete(id){
        const client = await clientModel.findByIdAndUpdate(id, {isDeleted : true});
        return client
    }

    static async Update(client_data){
        const client = await clientModel.findByIdAndUpdate(client_data._id, client_data);
        return client;
    }
}
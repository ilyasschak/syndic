import { roleModel } from "./config/models.js";

export default class RoleModel {
    
    static async getRoleId(title){
        const role = await roleModel.findOne({title : title})

        return role._id;
    }
}
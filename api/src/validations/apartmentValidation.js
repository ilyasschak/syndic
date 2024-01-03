import Joi from "joi";

const commonSchema = {
    number: Joi.number().min(1).required(),
    building: Joi.number().min(1).required(),
    status: Joi.string().valid('occupied', 'available').required(),
};

export default class ApartmentValidation{

    static validateApartmentNewClient(req, res){
        const schema = Joi.object({
            ...commonSchema,
            fullName: Joi.string().required(),
            cin: Joi.string().pattern(/^[A-Za-z]{1,2}[0-9]{5,6}$/).required().messages({
                'string.pattern.base': 'Invalid Moroccan Cin',
            })
        }).options({allowUnknown:true})

        return schema.validate(req.body, {abortEarly: false});
    }
    
    static validateApartment(req, res){
        const schema = Joi.object({
            ...commonSchema,
        }).options({allowUnknown:true})

        return schema.validate(req.body, {abortEarly: false});
    }

}
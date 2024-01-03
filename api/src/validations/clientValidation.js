import Joi from "joi";

export default function validateClient(req) {
    const schema = Joi.object({
        fullName: Joi.string().trim().min(1).required().messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name cannot be empty',
            'string.min': 'Full name must have at least {#limit} character',
            'any.required': 'Full name is required',
        }),
        cin: Joi.string().trim().pattern(/^[A-Za-z]{1,2}[0-9]{5,6}$/).required().messages({
            'string.base': 'CIN must be a string',
            'string.empty': 'CIN cannot be empty',
            'string.pattern.base': 'Invalid CIN format',
            'any.required': 'CIN is required',
        })
    }).options({allowUnknown:true});

    return schema.validate(req.body, {abortEarly: false});
}

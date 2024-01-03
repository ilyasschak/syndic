import Joi from "joi";

export default function validatePayment(req) {
    const schema = Joi.object({
        month: Joi.string()
            .required()
            .pattern(/^[a-zA-Z]+ \d{4}$/)
            .messages({
                "string.pattern.base":
                    'Month must be in the format "December 2023"',
                "any.required": "Month is required",
            }),
        amount: Joi.number().min(1).required().messages({
            "number.min": "Amount must be greater than or equal to 1",
            "any.required": "Amount is required",
        }),
        paymentMethod: Joi.string().valid("Cash", "Bank").required().messages({
            "any.only": 'Payment Method must be "Cash" or "Bank"',
            "any.required": "Payment Method is required",
        }),
    }).options({allowUnknown:true});

    return schema.validate(req.body, {abortEarly: false});
}

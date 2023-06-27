import Joi from 'joi';

const signUpSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    countryCode: Joi.string().required(),
    gender:Joi.string(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),

})

const logInSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),

})

const accountVerificationSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
})




export {
    signUpSchema,
    logInSchema,
    accountVerificationSchema,
   }
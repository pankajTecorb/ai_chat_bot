import Joi from 'joi';

const signUpSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required().min(4),
    // email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(4),
    confirmPassword: Joi.string().required().min(4),
});

const updateProfileSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    name: Joi.string().required().min(3)
})

export {
    signUpSchema,
    loginSchema,
    changePasswordSchema,
    updateProfileSchema
}
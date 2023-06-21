import { errors } from '@constants';
import Joi from 'joi';

const addFaqSchema = Joi.object({
    answer: Joi.string().required(),
    question:Joi.string().required()
});

export {
    addFaqSchema
}
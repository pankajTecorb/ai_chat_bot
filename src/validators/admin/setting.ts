import { errors } from '@constants';
import Joi from 'joi';
const settingScheme = Joi.object({
    //create

    andriodUserAppUrl: Joi.string().required(),
    andriodUserVersion: Joi.string().required(),
    andriodUserUpdateType: Joi.string().required(),
    iosUserAppUrl: Joi.string().required(),
    iosUserVersion: Joi.string().required(),
    iosUserUpdateType: Joi.string().required(),
});

export {
    settingScheme
}
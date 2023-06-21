import settingModel from '../../models/setting';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
/**
 * Admin register
 * 
 * @param body 
 * @returns 
 */
function registerSetting(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await settingModel.create(body)
            resolve(response)
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userExist, StatusCodes.INTERNAL_SERVER_ERROR))
            }
            reject(err)
        }
    });
}

//***********Edit*********/

function editSetting(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const data: any = await settingModel.findOne({});
            if (!data) {
                const response = await settingModel.create(body)
                resolve(response)
            } else {
                await settingModel.updateOne({}, body, { new: true });
                resolve({ success: true })
            }
        } catch (err) {
            reject(err)
        }
    });
}


//**** Detail By Id*****/

function detailSetting(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await settingModel.findOne({})
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.INTERNAL_SERVER_ERROR))
            } else {
                resolve(response)
            }
        } catch (err) {
            reject(err)

        }
    });
}



// Export default
export default {
    registerSetting,
    editSetting,
    detailSetting
} as const;

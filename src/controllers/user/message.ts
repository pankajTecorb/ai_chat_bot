import { userModel, messagesModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import moment from 'moment-timezone';

//********************** User Message Api ************************//

function userMessage(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const exitData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!exitData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const todayTime = moment().tz('Asia/Calcutta').format("hh:mm A")
                const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
                const obj = {
                    userId: userId,
                    message: body.message,
                    date: todayDate,
                    time: todayTime
                }
                const messageObj = await messagesModel.create(obj);
                resolve(messageObj)
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}
//**********************User  One Day Message Count Api ************************//

function messageCount(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userMessage: any = await messagesModel.countDocuments({ userId: userId, date: todayDate })
            if (!userMessage) {
                reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
            } else {
                resolve(userMessage)
            }
        } catch (err) {
            reject(err)
        }
    });
}

// Export default
export default {
    userMessage,
    messageCount,

} as const;

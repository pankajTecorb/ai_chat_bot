import { userModel, messagesModel, messagesSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import moment from 'moment-timezone';
import mongoose from 'mongoose';

//********************** User Session create Api ************************//

function userSession(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, sessionId } = body
            const exitData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!exitData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                if (userId && userId != undefined && sessionId && sessionId != undefined && sessionId != null && sessionId != '') {
                    const sessionData: any = await messagesSessionModel.findOne({ _id: sessionId, userId: userId, isDelete: false })
                    if (!sessionData) {
                        reject(new CustomError(errors.en.noSuchSessionExist, StatusCodes.BAD_REQUEST))
                    } else {
                        const obj = {
                            title: title,
                        }
                        const messageSessObj = await messagesSessionModel.updateOne({ _id: sessionData._id }, obj, { new: true });
                        resolve(messageSessObj)
                    }
                } else {
                    const todayTime = moment().tz('Asia/Calcutta').format("hh:mm A")
                    const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
                    const obj = {
                        userId: userId,
                        date: todayDate,
                        time: todayTime
                    }
                    const messageSessionObj = await messagesSessionModel.create(obj);
                    resolve({ userId: userId, sessionId: messageSessionObj._id })
                }

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

//********************** User Message Create/Update Api ************************//

function userMessage(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { message, sessionId, messageId, reply } = body;
            const exitData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!exitData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                if (messageId && messageId != undefined && messageId != null && messageId != '' && reply) {
                    const messageData: any = await messagesModel.findOne({ _id: messageId })
                    if (!messageData) {
                        reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                    } else {
                        const obj = {
                            userId: userId,
                            reply: reply,
                        }
                        const messageObj = await messagesModel.updateOne({ _id: messageData._id }, obj, { new: true });
                        resolve(messageObj)
                    }

                } else {
                    const todayTime = moment().tz('Asia/Calcutta').format("hh:mm A")
                    const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
                    const obj = {
                        userId: userId,
                        sessionId: sessionId,
                        message: message,
                        date: todayDate,
                        time: todayTime
                    }
                    const messageObj = await messagesModel.create(obj);
                    resolve(messageObj)
                }
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

//********************** User Message Reply Api ************************//

// function userMessageReply(body: any, userId: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const exitData: any = await userModel.findOne({ _id: userId, isDelete: false })
//             if (!exitData) {
//                 reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
//             } else {
//                 const todayTime = moment().tz('Asia/Calcutta').format("hh:mm A")
//                 const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
//                 const obj = {
//                     userId: userId,
//                     reply: body.reply,
//                     date: todayDate,
//                     time: todayTime
//                 }
//                 const messageObj = await messagesModel.updateOne({ _id: body.messageId }, obj, { new: true });
//                 resolve(messageObj)
//             }
//         } catch (err) {
//             console.log(err)
//             if (err.code == 11000) {
//                 reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST))
//             }
//             reject(err)
//         }
//     });
// }
//********************** User Session Histroy Api ************************//

function userSessionHistroy(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try { 
             let condition: any = {
                title: { $exists: true ,$ne: ''  } ,
                isDelete: false,
                userId: new mongoose.Types.ObjectId(userId)

            }
            const response = await messagesSessionModel.aggregate([
                {
                    $addFields: {
                        sessIds: { $toString: "$_id" },
                        userId: { $toObjectId: "$userId" },

                    },
                },
                // {
                //     $lookup: {
                //         localField: "sessIds",
                //         from: "messages",
                //         foreignField: "sessionId",
                //         as: "Messages",

                //     }
                // },
                // {
                //     $match: {
                //         "Messages.isDelete": false
                //     }
                // },
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $project: {title:1, date: 1, time: 1} },
                

            ])
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
            reject(err)

        }
    });
}

//********************** User Message Histroy Api ************************//

function userMessageHistroy(query:any ,userId:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
             let condition: any = {
                isDelete: false,
                userId: new mongoose.Types.ObjectId(userId),
                sessionId:query.sessionId

            }
            const response = await messagesModel.aggregate([
                {
                    $addFields: {
                        sessIds: { $toString: "$_id" },
                        userId: { $toObjectId: "$userId" },

                    },
                },
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $project: {date:1,sessionId:1,message:1 ,time:1 ,reply:1} }
                

            ])
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
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
    userSession,
    userMessage,
    messageCount,
    userSessionHistroy,
    userMessageHistroy

} as const;

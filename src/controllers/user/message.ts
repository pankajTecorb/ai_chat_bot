import { userModel, messagesModel, messagesSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { randomNumber } from '@utils/helpers'
const fs = require('fs');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

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
                title: { $exists: true, $ne: '' },
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
                { $project: { title: 1, date: 1, time: 1 } },


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

function userMessageHistroy(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let condition: any = {
                isDelete: false,
                userId: new mongoose.Types.ObjectId(userId),
                sessionId: query.sessionId

            }
            const response = await messagesModel.aggregate([
                {
                    $addFields: {
                        sessIds: { $toString: "$_id" },
                        userId: { $toObjectId: "$userId" },

                    },
                },
                { $match: condition },
                // { $sort: { createdAt: -1 } },
                { $project: { date: 1, sessionId: 1, message: 1, time: 1, reply: 1 } }


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
                reject(new CustomError(errors.en.notSendMessage, StatusCodes.UNAUTHORIZED))
            } else {
                resolve(userMessage)
            }
        } catch (err) {
            reject(err)
        }
    });
}


function userMessageListPdf(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { sessionId } = query
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userMessage: any = await messagesModel.find({ userId: userId, sessionId: sessionId }, { updatedAt: 0, createdAt: 0, isDelete: 0, isActive: 0, sessionId: 0, userId: 0, language: 0 })
            if (userMessage && userMessage.length > 0) {
                const valueNumber = randomNumber();
                const doc = new PDFDocument();
                // Set the output file path
                const outputPath = `./pdf/chat_history+${valueNumber}.pdf`;
                // Pipe the PDF document to a write stream
                const writeStream = fs.createWriteStream(outputPath);
                doc.pipe(writeStream);
                // Set the document font size
                doc.fontSize(12);
                // Iterate over each chat message
                userMessage.forEach((message: any) => {
                    doc.text(`Date: ${message.date}`, { continued: true });
                    doc.text(`Time: ${message.time}`, { continued: true });
                    doc.moveDown();
                    doc.text(`Message: ${message.message}`);
                    if (message.reply) {
                        doc.moveDown();
                        doc.text(`Reply: ${message.reply}`);
                    }
                    doc.moveDown(2);
                });

                // Finalize the PDF document
                doc.end();
                resolve({ file: outputPath })
                // Convert JSON to worksheet
                // const worksheet = XLSX.utils.json_to_sheet(userMessage);

                // // Create a new workbook
                // const workbook = XLSX.utils.book_new();

                // // Add the worksheet to the workbook
                // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // // Define the output file path
                // const outputPath = `./pdf/chat_history+${valueNumber}.xlsx`;

                // // Write the workbook to a file
                // XLSX.writeFile(workbook, outputPath);
                // resolve({ file: outputPath })


            } else {
                reject(new CustomError(errors.en.notSendMessage, StatusCodes.UNAUTHORIZED))
            }
        } catch (err) {
            reject(err)
        }
    });
}

function userMessageDelete(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let condition: any = {
                userId: userId,
                sessionId: query.sessionId
  }
            const response = await messagesModel.deleteMany(condition)
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


// Helper function to get the content type based on the format

// Export default
export default {
    userSession,
    userMessage,
    messageCount,
    userMessageDelete,
    userSessionHistroy,
    userMessageHistroy,
    userMessageListPdf

} as const;

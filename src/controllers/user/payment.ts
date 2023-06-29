const stripe = require('stripe')(process.env.Stripe_Secret_key)
import { userModel, messagesModel, messagesSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import moment from 'moment-timezone';
import mongoose from 'mongoose';

//********************** Create user Stripe Id  Api ************************//
function createStripeId(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const amount = 1000; // Amount in cents (e.g., $10.00)
            const currency = 'usd'; // Currency code (e.g., USD)
            const description = 'Test payment';
            const customerId = body.customerId; // Replace with the actual customer ID

            // const paymentIntent = await stripe.paymentIntents.create({
            //   amount: amount,
            //   currency: currency,
            //   description: description,
            //   customer: customerId,
            // });

            // // Confirm the payment intent to process the payment
            // await stripe.paymentIntents.confirm(paymentIntent.id);
            const cardNumber = '4242424242424242';
            const expMonth = 12;
            const expYear = 2024;
            const cvc = '123';
            const paymentMethod: any = await stripe.tokens.create({
                type: 'card',
                card: {
                    number: cardNumber,
                    exp_month: expMonth,
                    exp_year: expYear,
                    cvc: cvc,
                },
            });
            const paymentMethods = await stripe.paymentMethods.create({
                // type: 'card',
                card: {
                    token: paymentMethod.id,
                },
            });
            // return paymentMethod.id;
            // Payment successful
            // return paymentIntent;
            resolve({ paymentMethod, id: paymentMethods.id })
        } catch (error) {
            // Payment failed
            reject(error)
            throw error;
        }

        //         try {
        //             const { email, country = 'US',paymentIntentId ,customerId} = body
        //             const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
        //             const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
        //             if (!userData) {
        //                 reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
        //             } else {
        //                 // const customer = await stripe.customers.create({
        //                 //     name:"Pankaj kumar",
        //                 //     email:"pankaj@gmail.com",
        //                 //     phone:"6673878767"
        //                 // });


        //                 // resolve({customerId: customer.id })
        //                 const testToken = await stripe.tokens.create({
        //                     card: {
        //                       number: '4242424242424242',
        //                       exp_month: 12,
        //                       exp_year: 2024,
        //                       cvc: '123',
        //                     },
        //                   });
        //                   const card =await stripe.customer.createSource(customerId , {
        //                     source :`${testToken.id}`
        //                    })
        //                   resolve({ paymentMethodId: testToken.id ,all:testToken ,card:card.id ,nesAll:card});
        // //                 const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // //     const paymentResult = await stripe.paymentIntents.confirm(paymentIntent.id);
        // //    resolve({ paymentResult });
        //                  }
        //         } catch (err) {
        //             reject(err)
        //         }
    });
}

//********************** Confirm user Stripe Id  Api ************************//
function confirmPayment(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { paymentIntentId, amount, customerId } = body

            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    customer: customerId,
                    payment_method_types: ['card'],
                });

                resolve({ clientSecret: paymentIntent.client_secret, all: paymentIntent })

            }
        } catch (err) {
            reject(err)
        }
    });
}
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

// function userMessage(body: any, userId: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { message, sessionId, messageId, reply } = body;
//             const exitData: any = await userModel.findOne({ _id: userId, isDelete: false })
//             if (!exitData) {
//                 reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
//             } else {
//                 if (messageId && messageId != undefined && messageId != null && messageId != '' && reply) {
//                     const messageData: any = await messagesModel.findOne({ _id: messageId })
//                     if (!messageData) {
//                         reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
//                     } else {
//                         const obj = {
//                             userId: userId,
//                             reply: reply,
//                         }
//                         const messageObj = await messagesModel.updateOne({ _id: messageData._id }, obj, { new: true });
//                         resolve(messageObj)
//                     }

//                 } else {
//                     const todayTime = moment().tz('Asia/Calcutta').format("hh:mm A")
//                     const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
//                     const obj = {
//                         userId: userId,
//                         sessionId: sessionId,
//                         message: message,
//                         date: todayDate,
//                         time: todayTime
//                     }
//                     const messageObj = await messagesModel.create(obj);
//                     resolve(messageObj)
//                 }
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

// function userSessionHistroy(userId: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try { console.log(userId,"user")
//              let condition: any = {
//                 isDelete: false,
//                 userId: new mongoose.Types.ObjectId(userId)

//             }
//             const response = await messagesSessionModel.aggregate([
//                 {
//                     $addFields: {
//                         sessIds: { $toString: "$_id" },
//                         userId: { $toObjectId: "$userId" },

//                     },
//                 },
//                 // {
//                 //     $lookup: {
//                 //         localField: "sessIds",
//                 //         from: "messages",
//                 //         foreignField: "sessionId",
//                 //         as: "Messages",

//                 //     }
//                 // },
//                 // {
//                 //     $match: {
//                 //         "Messages.isDelete": false
//                 //     }
//                 // },
//                 { $match: condition },
//                 { $sort: { createdAt: -1 } },
//                 { $project: {title:1, date: 1, time: 1 , "Messages.date":1,"Messages.sessionId":1,"Messages.message":1 ,"Messages.time":1 ,"Messages.reply":1} },


//             ])
//             if (!response) {
//                 reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
//             } else {
//                 resolve(response)
//             }
//         } catch (err) {
//             reject(err)

//         }
//     });
// }

//********************** User Message Histroy Api ************************//

// function userMessageHistroy(query:any ,userId:any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try {
//              let condition: any = {
//                 isDelete: false,
//                 userId: new mongoose.Types.ObjectId(userId),
//                 sessionId:query.sessionId

//             }
//             const response = await messagesModel.aggregate([
//                 {
//                     $addFields: {
//                         sessIds: { $toString: "$_id" },
//                         userId: { $toObjectId: "$userId" },

//                     },
//                 },
//                 { $match: condition },
//                 { $sort: { createdAt: -1 } },
//                 { $project: {date:1,sessionId:1,message:1 ,time:1 ,reply:1} }


//             ])
//             if (!response) {
//                 reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
//             } else {
//                 resolve(response)
//             }
//         } catch (err) {
//             reject(err)

//         }
//     });
// }
//**********************User  One Day Message Count Api ************************//

// function messageCount(userId: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
//             const userMessage: any = await messagesModel.countDocuments({ userId: userId, date: todayDate })
//             if (!userMessage) {
//                 reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
//             } else {
//                 resolve(userMessage)
//             }
//         } catch (err) {
//             reject(err)
//         }
//     });
// }

// Export default
export default {
    createStripeId,
    confirmPayment,
    // userMessage,
    // messageCount,
    // userSessionHistroy,
    // userMessageHistroy

} as const;

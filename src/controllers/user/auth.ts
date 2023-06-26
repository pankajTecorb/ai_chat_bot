import { userModel, messagesModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import { randomNumber, getEpochAfterNSeconds } from "@utils/helpers";
import bcrypt from 'bcrypt';
const _ = require('lodash');
import moment from 'moment-timezone';

//********************** User Auth Api ************************//

/**
 * user SignUp
 * 
 * @param user 
 * @returns 
 */
function signUp(user: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { role = "User", email, countryCode, phoneNumber, name } = user
            const exitData: any = await userModel.findOne({ phoneNumber: phoneNumber, countryCode: countryCode, isDelete: false })
            if (exitData) {
                reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST))
            } else {
                user.role = role
                const userData: any = await userModel.create(user)
                // const token: string = jwt.sign({
                //     id: userData.id,
                //     role,
                //     userId: userData._id
                // }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                resolve({
                    // token: token,
                    name: userData.name,
                    phoneNumber: userData.phoneNumber,
                    _id: userData._id,
                })
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

/**
 * user signIn.
 * @returns 
 */
function login(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { countryCode, phoneNumber, role = "User" } = body;
            const userData: any = await userModel.findOne({ countryCode: countryCode, phoneNumber: phoneNumber, isDelete: false, isActive: true })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            } else if (userData.isActive == false) {
                reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
            } else {
                const token: string = jwt.sign({
                    id: userData.id,
                    role
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                await userModel.updateOne(
                    { _id: userData._id },
                    { lastLoginAt: getEpochAfterNSeconds(0) },
                    { userVerify: true }
                );
                const sessionObj = {
                    jwtToken: token,
                    userId: userData._id,
                    role: "User",
                };
                await userSessionModel.updateOne(
                    { userId: userData.id },
                    { $set: sessionObj }, { upsert: true }
                );

                resolve({
                    token,
                    name: userData.name,
                    _id: userData._id
                })
            }

        } catch (err) {
            reject(err)
        }
    });
}

/**
 * user Account verification
 * 
 * @param user 
 * @returns 
 */
function checkAccount(user: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { countryCode, phoneNumber } = user;
            const userData: any = await userModel.findOne({ countryCode: countryCode, phoneNumber: phoneNumber, isDelete: false })
            if (!userData) {
                resolve({ isUser: false })
            } else {
                if (userData.isActive) {
                    resolve({ isUser: true })
                } else {
                    reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
                }
            }
        } catch (err) {
            reject(err)
        }
    });
}
//**********Get Profile****** */
function getProfile(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await userModel.findOne({ _id: userId }, { "createdAt": 0, updatedAt: 0, lastLoginAt: 0, password: 0, isActive: 0, isDelete: 0, role: 0, userVerify: 0 })
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
            console.log(err);
            reject(err)
        }
    });
}
//*********** update Profile  *********/
function updateProfile(body: any, userId: string, file: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId });
            if (!userData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                if (file) {
                    body = {
                        ...body,
                        image: file.path
                    }
                }
                const userObj = await userModel.updateOne({ _id: userId }, body, { new: true });
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}


//********************** User Subscription Apis ************************//

function userSubscription(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { subscriptionType } = query   // OneDay , Weekly , Monthly ,Yearly
            const { timezone = "Asia/Calcutta" } = headers
            const userData: any = await userModel.findOne({ _id: userId })
            if (!userData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                //const todayTime = moment().tz(timezone).format("hh:mm A")
                const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
                if (subscriptionType == 'OneDay') {
                    const obj = {
                        subscription: true,
                        subscriptionType: subscriptionType,
                        subscriptionStartDate: todayDate,
                        subscriptionEndDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DD')
                    }
                    const userObj = await userModel.updateOne({ _id: userId }, obj, { new: true });
                    resolve(userObj)
                } else if (subscriptionType == 'Weekly') {
                    const obj = {
                        subscription: true,
                        subscriptionType: subscriptionType,
                        subscriptionStartDate: todayDate,
                        subscriptionEndDate: moment(new Date()).add(6, 'days').format('YYYY-MM-DD')
                    }
                    const userObj = await userModel.updateOne({ _id: userId }, obj, { new: true });
                    resolve(userObj)
                } else if (subscriptionType == 'Monthly') {
                    const obj = {
                        subscription: true,
                        subscriptionType: subscriptionType,
                        subscriptionStartDate: todayDate,
                        subscriptionEndDate: moment(new Date()).add(29, 'days').format('YYYY-MM-DD')
                    }

                    const userObj = await userModel.updateOne({ _id: userId }, obj, { new: true });
                    resolve(userObj)
                } else if(subscriptionType == 'Yearly') {
                    const obj = {
                        subscription: true,
                        subscriptionType: subscriptionType,
                        subscriptionStartDate: todayDate,
                        subscriptionEndDate: moment(new Date()).add(364, 'days').format('YYYY-MM-DD')
                    }

                    const userObj = await userModel.updateOne({ _id: userData._id }, obj, { new: true });
                    resolve(userObj)
                }else{
                    reject(new CustomError(errors.en.choseSub, StatusCodes.BAD_REQUEST))
                }

            }
        } catch (err) {
            reject(err)
        }
    });
}


// Export default
export default {
    login,
    signUp,
    checkAccount,
    getProfile,
    updateProfile,
    userSubscription
} as const;

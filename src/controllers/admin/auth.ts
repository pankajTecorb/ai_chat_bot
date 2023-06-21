import { adminModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import bcrypt from 'bcrypt';
import { errors } from '@constants';
const jwt = require('jsonwebtoken');
import moment from 'moment-timezone';


// Admin signup
function admin_signup(admin: any, headers: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const { password } = admin
            const { deviceToken, deviceType, deviceIp, timezone, language, currentVersion } = headers
            const pass = bcrypt.hashSync(password, 10);
            admin.password = pass;
            const response: any = await adminModel.create(admin);
            const token: string = jwt.sign({
                id: response.id,
                role: 'Admin',
                userId: response._id
            }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' });
            const sessionObj = {
                deviceToken: deviceToken,
                deviceType: deviceType,
                deviceIp: deviceIp,
                timezone: timezone,
                language: language,
                currentVersion: currentVersion,
                role: 'Admin',
                jwtToken: token,
                userId: response.id
            }
            await userSessionModel.create(sessionObj);
            resolve(response);
        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// Admin Login 
function login(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { deviceToken, deviceType, deviceIp, timezone, language, currentVersion } = headers;
            const { email, password } = body;
            const adminData: any = await adminModel.findOne({
                email
            });
            if (!adminData) {
                reject(new CustomError(errors.en.noSuchAccount, StatusCodes.BAD_REQUEST));
            }

            var match = bcrypt.compareSync(password, adminData.password);
            if (match == false) {
                reject(new CustomError(errors.en.WrongPassword, StatusCodes.BAD_REQUEST));
            } else {
                console.log(adminData.id, ";;", adminData._id)
                const token: string = jwt.sign({
                    id: adminData.id,
                    role: 'Admin',
                    userId: adminData._id
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' });
                const sessionObj = {
                    deviceToken: deviceToken,
                    deviceType: deviceType,
                    deviceIp: deviceIp,
                    timezone: timezone,
                    language: language,
                    currentVersion: currentVersion,
                    role: 'Admin',
                    jwtToken: token,
                    userId: adminData.id
                }
                await userSessionModel.create(sessionObj);
                resolve({
                    token,
                    isVerified: true,
                    isActive: adminData.isActive,
                    _id: adminData._id,
                    role: adminData.role
                });
            };
        } catch (err) {
            console.log(err);
            reject(err);
        };
    });
};

// change password
function changePassword(body: any, adminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = body
            const admin_details = await adminModel.findOne({ _id: adminId });
            if (admin_details) {
                var match = bcrypt.compareSync(oldPassword, admin_details.password);
                if (match == false) {
                    reject(new CustomError(errors.en.WrongOldPassword, StatusCodes.BAD_REQUEST))
                } else if (newPassword == confirmPassword) {
                    const pass = bcrypt.hashSync(newPassword, 10);
                    await adminModel.updateOne({ _id: adminId }, { password: pass });
                    resolve({ success: true })
                } else {
                    reject(new CustomError(errors.en.notSamePassword, StatusCodes.BAD_REQUEST))
                }
            } else {
                reject(new CustomError(errors.en.noSuchAccount, StatusCodes.BAD_REQUEST))
            }
        } catch (error) {
            console.log(error)
        }
    })
}

//  Logout
function logOut(headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = headers.authorization;
            await userSessionModel.updateOne({ jwtToken: token }, { status: false });
            resolve({ success: true });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default {
    admin_signup,
    login,
    changePassword,
    logOut
} as const;
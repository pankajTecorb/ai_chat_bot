const stripe = require('stripe')(process.env.Stripe_Secret_key)
import { userModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import moment from 'moment-timezone';
import mongoose from 'mongoose';

//********************** Create Customer Source Api ************************//
function createCustomerSource(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cardToken } = body
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const card = await stripe.customers.createSource(
                    userData.stripeId,
                    { source: cardToken }
                );
                resolve(card);
            }
        } catch (err) {
            reject(err)
        }
    });
}

//********************** Create Customer Payment Api ************************//
function createCustomerPyament(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cardAttachedID, amount } = body
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: (amount ? amount : 500) * 100, // The amount in the smallest currency unit (e.g., cents)
                    currency: 'inr', // The currency of the payment
                    customer: userData.stripeId, // The ID of the customer
                    payment_method_types: ['card'],
                    payment_method: cardAttachedID, // The ID of the source attached to the customer
                });
                const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
                resolve(confirmedPaymentIntent);
            }
        } catch (err) {
            reject(err)
        }
    });
}


//**********************  Customer Card Source  List Api ************************//
function customerCardPaymentList(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                var customerId: string = userData.stripeId
                const cards = await stripe.customers.listSources(customerId,
                    { object: 'card', limit: 50 }
                );
                resolve({ 'List': cards, Total: cards.length });
            }
        } catch (err) {
            reject(err)
        }
    });
}

//**********************  Customer Card Source  Update Api ************************//
function customerCardPaymentUpdate(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, cardId } = body
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                var customerId: string = userData.stripeId
                const card = await stripe.customers.updateSource(
                    customerId,
                    cardId,
                    { name: name }
                );
                resolve(card);
            }
        } catch (err) {
            reject(err)
        }
    });
}

//**********************  Customer Card Source  Delete Api ************************//
function customerCardPaymentDelete(body: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cardId } = body
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                var customerId: string = userData.stripeId
                const cards = await stripe.customers.deleteSource(
                    customerId,
                    cardId,
                );
                resolve(cards);
            }
        } catch (err) {
            reject(err)
        }
    });
}
//********************** Create Customer Source Api ************************//
function customerPaymentList(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const payments = await stripe.paymentIntents.list({
                    customer: userData.stripeId,
                    limit: 10, // Number of payment intents to retrieve (you can adjust this as needed)
                });
                resolve({ 'Payment History': payments.data });
            }
        } catch (err) {
            reject(err)
        }
    });
}







// Export default
export default {
    createCustomerSource,
    createCustomerPyament,
    customerPaymentList,
    customerCardPaymentList,
    customerCardPaymentUpdate,
    customerCardPaymentDelete



} as const;

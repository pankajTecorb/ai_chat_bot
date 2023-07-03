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
            const { cardToken, customerId } = body
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const card = await stripe.customers.createSource(
                    customerId,
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
            const { customerId, cardAttachedID } = body
            const todayDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: 500, // The amount in the smallest currency unit (e.g., cents)
                    currency: 'usd', // The currency of the payment
                    customer: customerId, // The ID of the customer
                    payment_method: cardAttachedID, // The ID of the source attached to the customer
                });
                const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
                //   if (confirmedPaymentIntent.status === 'requires_action') {
                //     const { type, redirect_to_url, use_stripe_sdk } = confirmedPaymentIntent.next_action;

                //     if (type === 'redirect_to_url') {
                //       // Redirect the customer to the authentication URL
                //       res.status(200).send({ redirectUrl: redirect_to_url.url });
                //     } else if (type === 'use_stripe_sdk') {
                //       // Present the payment authentication form to the customer using Stripe SDK
                //       res.status(200).send({ useStripeSdk: true });
                //     } else {
                //       // Handle other types of actions if necessary
                //       // ...
                //     }
                //   }
                resolve(confirmedPaymentIntent);
            }
        } catch (err) {
            reject(err)
        }
    });
}

//********************** Create Customer Source Api ************************//
function customerPaymentList(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { customerId } = query
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.UNAUTHORIZED))
            } else {
                const payments = await stripe.paymentIntents.list({
                    customer: customerId,
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
    customerPaymentList
   


} as const;

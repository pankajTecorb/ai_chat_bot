import { Schema, model } from 'mongoose';

interface Payment {
    userId: string;
    paymentId:string;
    amount: string;
    cardType: string;   // Debit , Cradit
    subscription: boolean;
    subscriptionType: string;   // OneDay , Weekly , Monthly ,Yearly
    subscriptionStartDate: string;  // Start Date of Subscription
    subscriptionEndDate: string;   //  End Date of Subscription
    paymentStatus:string      // succeeded
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Payment>({
    userId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: String },
    cardType: { type: String, default: "Debit" },
    subscription: { type: Boolean, default: false },
    subscriptionType: { type: String },
    subscriptionStartDate: { type: String },
    subscriptionEndDate: { type: String },
    paymentStatus: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const paymentModel = model<Payment>('Payments', schema);
export = paymentModel
import { Schema, model } from 'mongoose';


interface User {
  name: string;
  countryCode:string;
  email: string;
  role: string;
  image: string;
  gender:string  // Male ,Female , Other
  phoneNumber: string;
  subscription:boolean;
  subscriptionType:string;   // OneDay , Weekly , Monthly ,Yearly
  subscriptionStartDate:string;  // Start Date of Subscription
  subscriptionEndDate:string;   //  End Date of Subscription
  stripeId:string;       // Stripe Payment ID
  cronType:number;
  lastLoginAt: number;
  perDayMessageCount:number;
  userVerify:boolean;
  isActive: boolean;
  isDelete: boolean;


}

const schema = new Schema<User>({
  name: { type: String },
  countryCode: { type: String },
  email: { type: String },
  role: { type: String, default: "User" },
  image: { type: String},
  phoneNumber: { type: String },
  gender: { type: String },
  subscription: { type: Boolean, default: false },
  subscriptionType: { type: String },
  subscriptionStartDate: { type: String },
  subscriptionEndDate: { type: String },
  stripeId: { type: String },
  cronType: { type: Number },
  lastLoginAt: { type: Number },
  perDayMessageCount: { type: Number },
  userVerify: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, {
  timestamps: true,
  versionKey: false
});

// schema.index({ phoneNumber: 1 }, { unique: true });
const userModel = model<User>('users', schema);
export = userModel

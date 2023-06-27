import { Schema, model } from 'mongoose';

interface messagesSession {
    userId: String,
    date: string;
    title:string;
    language: string;
    time: string;
    isActive: boolean,
    isDelete: boolean,
}


const schema = new Schema<messagesSession>({
    userId: { type: String , required:true },
    date: { type: String },
    title: { type: String},
    language: { type: String, default: "en" },
    time: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const messagesSessionModel = model<messagesSession>('messagesSessions', schema);
export = messagesSessionModel
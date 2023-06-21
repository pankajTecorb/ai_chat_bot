import { Schema, model } from 'mongoose';

interface messages {
    userId: String,
    date: string;
    message:string;
    language: string;
    time: string;
    isActive: boolean,
    isDelete: boolean,
}


const schema = new Schema<messages>({
    userId: { type: String , required:true },
    date: { type: String },
    message: { type: String , required:true },
    language: { type: String, default: "en" },
    time: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const messagesModel = model<messages>('messages', schema);
export = messagesModel
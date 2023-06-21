import { Schema, model } from 'mongoose';

interface Faq {
    question: string;
    answer:string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Faq>({
    question: { type: String, required: true },
    answer: { type: String,required:true},    
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const faqModel = model<Faq>('Faq', schema);
export = faqModel
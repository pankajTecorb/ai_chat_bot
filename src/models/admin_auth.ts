import { Schema, model } from 'mongoose';


interface Admin {
    email: string;
    name: string;
    password: string;
    image: string;
    role: string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Admin>({
    email: { type: String },
    password: { type: String },
    name: { type: String },
    image: { type: String },
    role: { type: String, default: 'Admin' },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const adminModel = model<Admin>('admin', schema);
export = adminModel

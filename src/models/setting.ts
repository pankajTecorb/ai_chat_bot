import { Schema, model } from 'mongoose';
interface Setting {
    andriodUserAppUrl: string;
    andriodUserVersion: string;
    andriodUserUpdateType: string;
    iosUserAppUrl: string;
    iosUserVersion: string,
    iosUserUpdateType: string,
}
const schema = new Schema<Setting>({
    andriodUserAppUrl: { type: String, default: '' },
    andriodUserVersion: { type: String, default: '' },
    andriodUserUpdateType: { type: String, default: '' },
    iosUserAppUrl: { type: String, default: '' },
    iosUserVersion: { type: String, default: '' },
    iosUserUpdateType: { type: String, default: '' }
}, {
    timestamps: true,
    versionKey: false
});
const settingModel = model<Setting>('settings', schema);
export = settingModel 
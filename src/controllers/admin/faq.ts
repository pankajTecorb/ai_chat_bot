import { StatusCodes } from "http-status-codes";
import { errors } from "@constants";
import faqModel from "@models/faq";
import { CustomError } from "@utils/errors";



// Add Faq
function addFaq(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const Add = await faqModel.create(body);
            resolve(Add);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Faq
function editFaq(body: any, query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId } = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const checkFaq = await faqModel.findOne({ _id: faqId, isDelete: false });
                if (checkFaq) {
                    await faqModel.updateOne({ _id: faqId }, body);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

// faqList for Admin Pannel
function list_faq(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, search } = query;

            let condition: any = {
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { question: { $regex: search, $options: 'i' } },
                        { answer: { $regex: search, $options: 'i' } },
                    ]
                }
            }
            const totalCount = await faqModel.count(condition)
            const list = await faqModel.find(condition).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            resolve({ items: list, totalCount: totalCount });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// faq details
function details(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId } = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const details = await faqModel.findOne({ _id: faqId, isDelete: false }).sort({ createdAt: -1 });
                if (details) {
                    resolve({ response: details });
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
// faq delete
function delete_faq(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId } = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const details = await faqModel.findOne({ _id: faqId });
                if (details) {
                    await faqModel.updateOne({ _id: faqId }, { isDelete: true });
                    resolve({ success: true })
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

export default {
    addFaq,
    editFaq,
    list_faq,
    details,
    delete_faq
} as const;
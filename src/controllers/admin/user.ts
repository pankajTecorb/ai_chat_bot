import { userModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';

//*********** User Listing   *********/
function userListing(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, pageSize = 10, search, status } = query;
            let condition: any = {
                isDelete: false,
                isActive: status
            }
            if (status == 'true') {
                condition = {
                    ...condition,
                    isActive: true
                }
            } else {
                condition = {
                    ...condition,
                    isActive: false
                }
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { "userAddress.state": { $regex: search, $options: 'i' } },
                        { "userAddress.city": { $regex: search, $options: 'i' } },
                    ]
                }
            }
            const userData = await userModel.aggregate([
                {
                    $addFields: {
                        userid: { $toObjectId: "$_id" },

                    },
                },
                {
                    $lookup: {
                        from: "addresses",
                        let: { client_id: "$userid" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$userId", "$$client_id"] } }, },
                            { $project: { _id: 1, city: 1, state: 1, isPrimary: 1, lat: 1, long: 1 } }
                        ],
                        as: "userAddress"
                    }
                },
                {
                    $lookup: {
                        localField: "userid",
                        from: "posts",
                        foreignField: "userId",
                        as: "userPost",

                    }
                },
                {
                    $lookup: {
                        localField: "userid",
                        from: "followfollowees",
                        foreignField: "followeeId",
                        as: "userFollower",

                    }
                },
                {
                    $lookup: {
                        localField: "userid",
                        from: "followfollowees",
                        foreignField: "followerId",
                        as: "userFollowee",

                    }
                },

                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(pageSize) },
                { $limit: Number(pageSize) },

                {
                    $project: {
                        postCount: { $size: "$userPost" },
                        follower: { $size: "$userFollower" },
                        followee: { $size: "$userFollowee" },
                        //"userPost.likeCount": 0,
                        // postShare: 0,
                        "name": 1,
                        "email": 1,
                        "createdAt": 1,
                        "isActive": 1,
                        "lastLoginAt": 1,
                        "userAddress.city": 1,
                        "userAddress.state": 1,
                        "userAddress.isPrimary": 1
                    }
                }
            ])
            const Total = await userModel.aggregate([
                {
                    $addFields: {
                        userid: { $toObjectId: "$_id" },

                    },
                },
                {
                    $lookup: {
                        localField: "userid",
                        from: "address",
                        foreignField: "userId",
                        as: "userAddress",

                    }
                },
                { $match: condition },
            ])
            resolve({ items: userData, totalCount: Total.length });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

//*********** Update Profile  *********/
function updateProfile(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: body.userId });
            if (!userData) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                // if (file) {
                //     body = {
                //         ...body,
                //         image: file.path
                //     }
                // }
                const userObj = await userModel.updateOne({ _id: body.userId }, body, { new: true });
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}
//*********** Deactive Profile  *********/
function userDeactive(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await userModel.findOne({ _id: query.userId, isDelete: false })
            if (details) {
                const userObj = await userModel.updateOne({ _id: details._id }, { $set: { isActive: false } });
                resolve(userObj)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
// Export default
export default {
    userListing,
    updateProfile,
    userDeactive

} as const;



import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import { userModel } from '@models/index';
import { reject } from 'promise';
import mongoose from 'mongoose';
import { sendEmail } from '@utils/helpers';
import { Request, Response, Router } from 'express';
const _ = require('lodash');
import moment from 'moment-timezone';
var timezone = 'asia/kolkata';
var todaytimes= moment(new Date()).tz(timezone).format("hh:mm")


var cron = require('node-cron');

cron.schedule('0 0 0 * * *', async () => {
    
    var date = moment(new Date()).subtract(1, 'days').tz(timezone).format('YYYY-MM-DD');
    console.log("Running cron every midnight to change subscription key false  s1")
    
    const userData: any = await userModel.find({ subscriptionEndDate: { $lt: date } }, { _id: 1 })
    for (var i = 0; i < userData.length; i++) {
        const editData = {
            subscription: false,
            subscriptionType:"Expire",
            cronType:1
        }
        const userUpdateData = await userModel.updateOne({ _id: userData[i]._id }, editData, { new: true });
    }
},
{
        scheduled: true,
        timezone: "Asia/Kolkata"
      })

      cron.schedule('0 0 0 * * *', async () => {
    
        var date = moment(new Date()).add(1, 'days').tz(timezone).format('YYYY-MM-DD');
        console.log("Running cron every midnight to change subscription key false add1")
        const userData: any = await userModel.find({ subscriptionEndDate: { $lt: date } }, { _id: 1 })
        for (var i = 0; i < userData.length; i++) {
            const editData = {
                subscription: false,
                subscriptionType:"Expire",
                cronType:2
            }
            const userUpdateData = await userModel.updateOne({ _id: userData[i]._id }, editData, { new: true });
        }
    },
    {
            scheduled: true,
            timezone: "Asia/Kolkata"
          })

          cron.schedule('0 0 0 * * *', async () => {
    
            var date = moment(new Date()).tz(timezone).format('YYYY-MM-DD');
            console.log("Running cron every midnight to change subscription key false ")
            const userData: any = await userModel.find({ subscriptionEndDate: { $lt: date } }, { _id: 1 })
            for (var i = 0; i < userData.length; i++) {
                const editData = {
                    subscription: false,
                    subscriptionType:"Expire",
                    cronType:3
                }
                const userUpdateData = await userModel.updateOne({ _id: userData[i]._id }, editData, { new: true });
            }
        },
        {
                scheduled: true,
                timezone: "Asia/Kolkata"
              })
// cron.schedule('0 15 * * *', async () => {
//     console.log("Running cron every 3PM to send Second reminder ")
//     var today = moment(new Date()).format('YYYY-MM-DD');
//     var past2date = moment(new Date()).subtract(3, 'days').format('YYYY-MM-DD');
//     const notreviewData: any = await sendreviewurlModel.find({ reviewTrue: false, reminderCount: 1, isDelete: false, todayUpdate: { $exists: true }, date: { $gte: past2date } })
//     for (var i = 0; i < notreviewData.length; i++) {
//        // console.log(notreviewData[i])
//         const revieInvitediscount: any = await reviewdiscountVoucherModel.findOne({ businessId: notreviewData[i].businessId, isActive: true, isDelete: false })
//         const businessDataforvalues: any = await businessModel.findOne({ _id: notreviewData[i].businessId, isActive: true, isDelete: false })
//         if (revieInvitediscount && revieInvitediscount.imageUrl) {
//             var busiensImageInvite: any = revieInvitediscount.imageUrl
//         } else if (businessDataforvalues && businessDataforvalues.image) {
//             var busiensImageInvite: any = businessDataforvalues.image
//         } else {
//             var busiensImageInvite: any = "https://res.cloudinary.com/tecorbssvan/image/upload/v1670577564/li8l7vvqw8m2qspc8avg.png"
//         }
//         if (businessDataforvalues && businessDataforvalues.businessName) {
//             var businessnames: any = businessDataforvalues.businessName
//         } else {
//             var businessnames: any = "Nessviews"
//         }
//         var encryptedPhone: any = Buffer.from(`${notreviewData[i].phoneNumber}`).toString('base64')
//         var encryptedName: any = Buffer.from(`${notreviewData[i].userName}`).toString('base64')
//         if (notreviewData[i].todayUpdate == today) {
//             console.log("Today send first reminder")
//         } else if (moment(notreviewData[i].todayUpdate).add(2, 'days').format('YYYY-MM-DD') == today) {
//             if (revieInvitediscount) {
//                 sendWhatsappViaDialof360template({
//                     "to": `${91}${notreviewData[i].phoneNumber}`,
//                     "recipient_type": "individual",
//                     "type": "template",
//                     "template": {
//                         "namespace": "adaa10d5_9758_4f74_944c_3b6be4083a7a",
//                         "name": "business_review_invite_reminder2",
//                         "language": {
//                             "code": "en",
//                             "policy": "deterministic"
//                         },
//                         "components": [
//                             {
//                                 "type": "header",
//                                 "parameters": [{
//                                     "type": "image",
//                                     "image": {
//                                         "link": busiensImageInvite
//                                     }
//                                 }]
//                             },
//                             {
//                                 "type": "body",
//                                 "parameters": [
//                                     {
//                                         "type": "text",
//                                         "text": businessnames
//                                     }
//                                 ]
//                             }, {
//                                 "type": "button",
//                                 "index": "0",
//                                 "sub_type": "url",
//                                 "parameters": [
//                                     {
//                                         "type": "text",
//                                         //"text": `business-details/add-review/${notreviewData[i].businessId}`
//                                         "text": `business-details/add-review/${notreviewData[i].businessId}?phone=${encryptedPhone}`
                                        
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 })
//             } else {
//                 sendWhatsappViaDialof360template({
//                     "to": `${91}${notreviewData[i].phoneNumber}`,
//                     "recipient_type": "individual",
//                     "type": "template",
//                     "template": {
//                         "namespace": "adaa10d5_9758_4f74_944c_3b6be4083a7a",
//                         "name": "business_review_without_reminder2",
//                         "language": {
//                             "code": "en",
//                             "policy": "deterministic"
//                         },
//                         "components": [
//                             {
//                                 "type": "header",
//                                 "parameters": [{
//                                     "type": "image",
//                                     "image": {
//                                         "link": busiensImageInvite
//                                     }
//                                 }]
//                             },
//                             {
//                                 "type": "body",
//                                 "parameters": [
//                                     {
//                                         "type": "text",
//                                         "text": businessnames
//                                     }
//                                 ]
//                             }, {
//                                 "type": "button",
//                                 "index": "0",
//                                 "sub_type": "url",
//                                 "parameters": [
//                                     {
//                                         "type": "text",
//                                         //"text": `business-details/add-review/${notreviewData[i].businessId}`
//                                         "text": `business-details/add-review/${notreviewData[i].businessId}?phone=${encryptedPhone}`
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 })
//             }
//             const editData = {
//                 reminderCount: 2
//             }
//             const businessDatas = await sendreviewurlModel.updateOne({ _id: notreviewData[i]._id }, editData, { new: true });
//         }

//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
//   })





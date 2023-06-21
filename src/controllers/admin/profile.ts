import adminModel from "@models/admin_auth";



function profileDetails(body: any, adminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await adminModel.findById({ _id: adminId },{password:0});
            resolve(details);
        } catch (err) {
            console.log(err)
        }
    });
}

function updateProfile(body: any, adminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let obj = {
                name: body.name,
                email: body.email
            }
            await adminModel.updateOne({ _id: adminId }, obj);
            resolve({ success: true });

        } catch (err) {
            console.log(err)
        }
    })
}


export default {
    profileDetails,
    updateProfile
}
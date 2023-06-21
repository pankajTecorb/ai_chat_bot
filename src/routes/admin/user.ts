import { StatusCodes } from "http-status-codes";
import { success } from "@constants";
import { Response, Router, Request } from 'express'
import schemaValidator from "@utils/schemaValidator";
import userController from "@controllers/admin/user";
import { checkRole, verifyAuthToken } from "@utils/authValidator";


//Constant
var router = Router();
const { CREATED, OK } = StatusCodes;

export const p = {
    list: '/list',
    updateProfile: '/updateProfile',
    userDeactive:'/userDeactive'
    
} as const


/***************User Listing****************/
router.get(p.list, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userController.userListing(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});


/***************User Update Profile****************/
router.put(p.updateProfile, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userController.updateProfile(req.body );
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
/***************User Deactive****************/
router.put(p.userDeactive, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userController.userDeactive(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});



export default router;
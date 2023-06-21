import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import authController from '../../controllers/admin/auth';
import { loginSchema, signUpSchema,changePasswordSchema } from "@validators/admin/auth";
import { verifyAuthToken, checkRole } from "../../utils/authValidator";
import upload from '@utils/multer';
import schemaValidator from '@utils/schemaValidator';
import { success } from '@constants';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    signup: '/signup',
    login: '/login',
    changePassword:'/changePassword',
    logout:'/logout'
} as const;

/**
 * Login & SignUp  Admin
 */
router.post(p.signup,schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await authController.admin_signup(req.body,req.headers);
    return res.status(CREATED).send({ data,code:CREATED,message:success.en.signupSuccessful });
});
//***********Login******** */
router.post(p.login, schemaValidator(loginSchema), async (req: Request, res: Response) => {
    const data = await authController.login(req.body,req.headers);
    return res.status(OK).send({...data, code: OK,message:success.en.loginSuccessful})
});
//***********change password*******Request* */
router.post(p.changePassword,verifyAuthToken,checkRole(['Admin']), schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await authController.changePassword(req.body,req.user.id);
    return res.status(OK).send({data,code: OK,message:success.en.updatePassword})
});

/////////////////////// User Logout ///////////////////////
router.get(p.logout, async (req: Request, res: Response) => {
    const data = await authController.logOut(req.headers);
    return res.status(OK).send({ data, code: OK, message: success.en.logOutSuccessful});
});

// Export default
export default router;

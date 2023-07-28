import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userAuthController from '@controllers/user/auth';
import { success } from '@constants';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema, logInSchema, accountVerificationSchema} from "@validators/auth"
import { verifyAuthToken } from "@utils/authValidator";
import upload from '@utils/multer'

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/login',
    signUp: '/signup',
    check: '/check-account',
     get: '/get',
    update: '/update',
    subscription:'/subscription',
    logout:'/logout',
    sendOTP:'/sendOTP'
} as const;

/**
 * User SignUp
 */
router.post(p.signUp, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.signUp(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.signupSuccessful});
});

/**
 * Mark account Verified
 */
router.post(p.check,  schemaValidator(accountVerificationSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.checkAccount(req.body);
    return res.status(OK).send({ data, code: OK, message: data.isUser ? success.en.accountExists: success.en.noSuchAccountExist });
});

/**
 * User Login
 */
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await userAuthController.login(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.loginSuccessful });
});

//**********Get Profile****** */
router.get(p.get, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userAuthController.getProfile(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});
//**********Update Profile****** */
router.put(p.update, verifyAuthToken, upload.single('image'),async (req: any, res: Response) => {
    const data = await userAuthController.updateProfile(req.body, req.user.id ,req.file);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});
//**********Subscription ****** */
router.post(p.subscription, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userAuthController.userSubscription(req.body, req.user.id ,req.headers);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});
//**********Log Out User ****** */
router.get(p.logout, verifyAuthToken, async (req: any, res: Response) => {
    const data = await userAuthController.logOut( req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});

/**
 *  Send OTP
 */
router.post(p.sendOTP, async (req: Request, res: Response) => {
    const data = await userAuthController.sendOtp(req.body);
    return res.status(OK).send({ data, code: OK, message: success.en.success});
});

// Export default
export default router;

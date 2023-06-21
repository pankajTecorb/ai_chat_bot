import profileController from '../../controllers/admin/profile'
import { Request, Response, Router } from 'express';
import { STATUS_CODES } from 'http';
import StatusCode from 'http-status-codes'
import { verifyAuthToken, checkRole } from "../../utils/authValidator";
import { success } from '../../constants';
import { AnyARecord } from 'dns';
import schemaValidator from '@utils/schemaValidator';
import { updateProfileSchema } from '@validators/admin/auth';

//constant 
const router = Router();
const { CREATED, OK } = StatusCode
export const p = {
    details: '/details',
    updateProfile: '/updateProfile'
} as const

//profile details
router.get(p.details, verifyAuthToken, checkRole(['Admin']), async (req: any, res: any) => {
    const data = await profileController.profileDetails(req.body, req.user.id);
    return res.status(OK).send({ data,code:OK, message: success.en.recordFetched });
});

//update profile
router.put(p.updateProfile, verifyAuthToken, checkRole(['Admin']),schemaValidator(updateProfileSchema), async (req: any, res: any) => {
    const data = await profileController.updateProfile(req.body, req.user.id);
    return res.status(CREATED).send({code:CREATED, message: success.en.profileUpdate })
})

export default router
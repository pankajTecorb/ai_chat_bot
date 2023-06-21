import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import settingController from '@controllers/admin/setting';
import schemaValidator from '@utils/schemaValidator';
import { settingScheme } from "../../validators/admin/setting";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import { string } from 'joi';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    update: '/edit',
    Detail: '/detail',

} as const;

//**** Edit****/
router.put(p.update, verifyAuthToken, checkRole(['Admin']), schemaValidator(settingScheme), async (req: Request, res: Response) => {
    const data = await settingController.editSetting(req.body);
    return res.status(OK).send({ data, code: OK })
});


//***** Detail**** */
router.get(p.Detail, verifyAuthToken, checkRole(['Admin']), async (req: Request, res: Response) => {
    const data = await settingController.detailSetting();
    return res.status(OK).send({ data, code: OK })
})




// Export default
export default router;

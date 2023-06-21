import { StatusCodes } from "http-status-codes";
import { success } from "../../constants";
import { Response, Router, Request } from 'express'
import schemaValidator from "../../utils/schemaValidator";
import faq_commonController from "../../controllers/admin/faq";
import { checkRole, verifyAuthToken } from "../../utils/authValidator";
import { addFaqSchema } from "../../validators/admin/faq";

//Constant
var router = Router();
const { CREATED, OK } = StatusCodes;

export const p = {
    addFaq: '/add',
    editFaq: '/edit',
    list: '/faq_List',
    details:'/details',
    delete:'/delete'
} as const


//Add Faq
router.post(p.addFaq, verifyAuthToken, checkRole(['Admin']), schemaValidator(addFaqSchema), async (req: any, res: Response) => {
    const data = await faq_commonController.addFaq(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.addFaq });
});

//Edit Faq
router.put(p.editFaq, verifyAuthToken, checkRole(['Admin']), schemaValidator(addFaqSchema), async (req: any, res: Response) => {
    const data = await faq_commonController.editFaq(req.body, req.query);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.editFaq });
});

//LIST Faq
router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await faq_commonController.list_faq(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
});
// Faq details
router.get(p.details, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await faq_commonController.details(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
});
// Faq delete
router.delete(p.delete, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await faq_commonController.delete_faq(req.query);
    return res.status(OK).send({ data, code: OK, message: 'success' });
});


export default router;
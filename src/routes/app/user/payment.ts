import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import paymentController from '@controllers/user/payment';
import { success } from '@constants';
import { verifyAuthToken } from "@utils/authValidator";



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    customerSource: '/customer-source',
    customerPayment:'/customer-payment',
    paymentHistory:'/payment-history',
    paymentCard :'/card-list',
    paymentCardUpdate :'/card-update',
    paymentCardDelete :'/card-delete',
    paymentStatus :'/payment-status',
    paymentConfirm:'/payment-confirm'
    
   

} as const;
//************************ User Session create***********************************//
router.post(p.customerSource, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.createCustomerSource(req.body, req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});

router.post(p.customerPayment, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.createCustomerPyament(req.body, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});


router.get(p.paymentHistory, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.customerPaymentList(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.get(p.paymentCard, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.customerCardPaymentList(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.post(p.paymentCardUpdate, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.customerCardPaymentUpdate(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.get(p.paymentStatus, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.customerPaymentstatus(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.post(p.paymentCardDelete, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.customerCardPaymentDelete(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

router.post(p.paymentConfirm, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.confirmCustomerPyament(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

// Export default
export default router;

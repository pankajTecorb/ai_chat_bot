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
    createStripeId: '/create-stripeId',
    confirmPayment:'/confirm-payment',
    // messageCount: '/count',
    // session:'/session',
    // chatHistory:'/chat-history',
    // messageHistory:'/message-history'

} as const;
//************************ User Session create***********************************//
router.post(p.createStripeId, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.createStripeId(req.body, req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});

router.post(p.confirmPayment, verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.confirmPayment(req.body, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});


// router.get(p.messageCount, verifyAuthToken, async (req: any, res: Response) => {
//     const data = await paymentController.messageCount(req.user.id);
//     return res.status(OK).send({ data, code: OK, message: success.en.success });
// });
// router.get(p.chatHistory, verifyAuthToken, async (req: any, res: Response) => {
//     const data = await paymentController.userSessionHistroy(req.user.id);
//     return res.status(OK).send({ data, code: OK, message: success.en.success });
// });
// router.get(p.messageHistory, verifyAuthToken, async (req: any, res: Response) => {
//     const data = await messageController.userMessageHistroy(req.query,req.user.id);
//     return res.status(OK).send({ data, code: OK, message: success.en.success });
// });


// Export default
export default router;

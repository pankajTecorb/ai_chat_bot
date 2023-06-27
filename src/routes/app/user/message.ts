import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import messageController from '@controllers/user/message';
import { success } from '@constants';
import { verifyAuthToken } from "@utils/authValidator";


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    message: '/send',
    messageCount: '/count',
    session:'/session',
    chatHistory:'/chat-history',
    messageHistory:'/message-history'

} as const;
//************************ User Session create***********************************//
router.post(p.session, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userSession(req.body, req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});

router.post(p.message, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userMessage(req.body, req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});


router.get(p.messageCount, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.messageCount(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.get(p.chatHistory, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userSessionHistroy(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.get(p.messageHistory, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userMessageHistroy(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});


// Export default
export default router;

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

} as const;


router.post(p.message, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userMessage(req.body, req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});


router.get(p.messageCount, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.messageCount(req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});


// Export default
export default router;

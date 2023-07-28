import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import messageController from '@controllers/user/message';
import { success } from '@constants';
import { verifyAuthToken } from "@utils/authValidator";
import fs from 'fs';


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    message: '/send',
    messageCount: '/count',
    session: '/session',
    chatHistory: '/chat-history',
    messageHistory: '/message-history',
    userMessageList: '/userMessagePdf',
    userMessageDelete:'/userMessageDelete'

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
    const data = await messageController.userMessageHistroy(req.query, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});
router.get(p.userMessageList, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userMessageListPdf(req.query, req.user.id);
    //res.setHeader('Content-Disposition', `attachment; filename=${data.file}`);
   // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Type', 'application/pdf');
    setTimeout(() => {
        res.download(data.file);

    }, 1000)
    setTimeout(() => {
        console.log("deleting temp report file...")
        if (fs.existsSync(data.file)) {
            fs.unlinkSync(data.file);

            console.log("deleted file...")
        } else {
            console.log("No such file exist...")
        }
    }, 3000)
   // return res.status(OK).send({ data, file: data.file, code: OK, message: success.en.success });
});

router.get(p.userMessageDelete, verifyAuthToken, async (req: any, res: Response) => {
    const data = await messageController.userMessageDelete(req.query, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

// Export default
export default router;

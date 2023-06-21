import { Router } from 'express';
import { Request, Response } from 'express';
import path from 'path';
const viewsDir = path.join(__dirname, '../../public/admin/views');

const baseRouter = Router();

/***********************************************************************************
 *                                  Front-end routes
 **********************************************************************************/
baseRouter.get('/', (_: Request, res: Response) => {
    res.redirect('/admin/login')
});

//***********Login Page*************//
baseRouter.get('/login', (_: Request, res: Response) => {
    res.sendFile('auth/login.html', { root: viewsDir });
});

baseRouter.get('/changepassword', (_: Request, res: Response) => {
    res.sendFile('setting/changepassword.html', { root: viewsDir });
});
baseRouter.get('/appversion', (_: Request, res: Response) => {
    res.sendFile('setting/app_version.html', { root: viewsDir });
});
baseRouter.get('/user', (_: Request, res: Response) => {
    res.sendFile('user/userList.html', { root: viewsDir });
});
baseRouter.get('/userProfile', (_: Request, res: Response) => {
    res.sendFile('user/userProfile.html', { root: viewsDir });
});
export default baseRouter;
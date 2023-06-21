import { Router } from 'express';
import authRouter from './auth';
import faqRouter from './faq';
import profileRouter from './profile';
import settingRouter from './setting';
import userRoute from './user'
// Export the base-router
const adminbaseRouter = Router();

// Setup routers
adminbaseRouter.use('/auth', authRouter);
adminbaseRouter.use('/faq', faqRouter);
adminbaseRouter.use('/profile', profileRouter);
adminbaseRouter.use('/setting', settingRouter);
adminbaseRouter.use('/user', userRoute);


// Export default.
export default adminbaseRouter;
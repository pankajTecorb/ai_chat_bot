import { Router } from 'express';
import authRoute from './auth';
import messageRoute from './message';
import paymentRoute from './payment'



// Export the base-router

const baseRouter = Router();

// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/message' , messageRoute);
baseRouter.use('/payment' , paymentRoute);



// Export default.
export default baseRouter;
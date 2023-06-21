import { Router } from 'express';
import authRoute from './auth';
import messageRoute from './message'



// Export the base-router

const baseRouter = Router();

// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/message' , messageRoute);



// Export default.
export default baseRouter;
import {Router} from "express";
import { createSubscription, showAllSubscription, subscriptionById } from "../controllers/subscription.controller";
import authorize from "../middlewares/authorize.middleware";

const subscriptionRouter = Router();

subscriptionRouter.get('/get-all-subscriptions',showAllSubscription);
subscriptionRouter.get('/:id',authorize,subscriptionById);
subscriptionRouter.post('/create-subscription',authorize,createSubscription);
// subscriptionRouter.put('/:id');
// subscriptionRouter.delete('/:id');
// subscriptionRouter.get('/user/:id');
// subscriptionRouter.put('/:id/cancel');
// subscriptionRouter.get('/up-coming-renewals');

export default subscriptionRouter;
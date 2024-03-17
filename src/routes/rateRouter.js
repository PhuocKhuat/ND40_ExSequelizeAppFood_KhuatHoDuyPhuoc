import express from 'express';
import { getRateListByRes, getRateListByUser } from '../controllers/rateController.js';

const rateRouter = express.Router();
rateRouter.get("/get-rate-list-by-res/:resId", getRateListByRes);
rateRouter.get("/get-rate-list-by-user/:userId", getRateListByUser);

export default rateRouter;
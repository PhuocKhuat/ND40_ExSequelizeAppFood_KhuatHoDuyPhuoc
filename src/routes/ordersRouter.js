import express from 'express';
import addOrders from '../controllers/ordersController.js';

const ordersRouter = express.Router();

ordersRouter.post("/add-orders", addOrders);

export default ordersRouter;
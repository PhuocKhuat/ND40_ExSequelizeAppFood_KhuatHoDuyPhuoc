import express from 'express';
import { getLikeList } from '../controllers/likeController.js';

const likeRouter = express.Router();
likeRouter.get("/get-like-list", getLikeList);

export default likeRouter;
import express from 'express';
import { getLikeListByRes, getLikeListByUser, likeUnlike } from '../controllers/likeController.js';

const likeRouter = express.Router();
likeRouter.post("/like-unlike", likeUnlike);
likeRouter.get("/get-like-list-by-res/:resId", getLikeListByRes);
likeRouter.get("/get-like-list-by-user/:userId", getLikeListByUser);

export default likeRouter;
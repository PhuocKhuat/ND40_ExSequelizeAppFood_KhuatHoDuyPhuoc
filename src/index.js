import express from 'express'
import cors from 'cors'
import rootRouter from './routes/rootRouter.js';

const app = express();
app.use(cors());
app.listen(8080);
app.use(rootRouter);
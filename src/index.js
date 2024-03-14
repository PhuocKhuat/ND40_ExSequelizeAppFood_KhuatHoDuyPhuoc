import express from 'express'
import rootRouter from './routes/rootRouter.js';

const app = express();
app.listen(8080);
app.use(rootRouter);
import express from 'express';
import cors from 'cors';
import { promoRouter } from './routes/promoRouter.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use('/api', promoRouter);

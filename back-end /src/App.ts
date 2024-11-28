import cors from 'cors'

import dotenv from 'dotenv'; 
dotenv.config();

import express, { Application } from 'express';
import rideRoutes from './routers/rides.router';
import { validateParamsCustomerId } from './middlewares/ride.middleware';

export const app: Application = express();

app.use(cors());

app.use(express.json());
// app.use('/ride', validateParamsCustomerId, rideRoutes);
app.use('/ride', rideRoutes, validateParamsCustomerId);
// app.use('/ride',rideRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});




import express from 'express';
import { estimatingRidesController,
        confirmRideController,
        getCustomerRidesController
    } from '../controllers/rides.controller';

const router = express.Router();

router.post('/estimate', estimatingRidesController);

router.patch('/confirm', confirmRideController);

router.get('/:customer_id', getCustomerRidesController);

export default router



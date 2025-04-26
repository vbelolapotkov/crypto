import { Router } from 'express';
import { getWalletBalance } from '../controllers/bybit';

const router = Router();

router.get('/wallet', getWalletBalance);

export default router;

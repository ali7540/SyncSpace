import { Router } from 'express';
import authRoutes from './auth.routes.js';
import documentRoutes from './document.routes.js'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/docs', documentRoutes);

export default router;
import { Router } from 'express';
import { getDocuments, createDocument } from '../controllers/document.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDocuments);

router.post('/', createDocument);

export default router;
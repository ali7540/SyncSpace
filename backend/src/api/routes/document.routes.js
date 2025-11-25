import { Router } from 'express';
import { getDocuments, createDocument, getDocumentById, updateDocument, deleteDocument, shareDocument } from '../controllers/document.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDocuments);

router.post('/', createDocument);

router.get('/:id', getDocumentById);

router.put('/:id', updateDocument);

router.delete('/:id', deleteDocument);

router.post('/:id/share', shareDocument);

export default router;
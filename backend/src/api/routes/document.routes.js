import { Router } from 'express';
import { getDocuments, createDocument, getDocumentById, updateDocument, deleteDocument, shareDocument } from '../controllers/document.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { getVersions, createVersion, deleteVersion } from '../controllers/version.controller.js'; 

const router = Router();

router.use(requireAuth);

router.get('/', getDocuments);

router.post('/', createDocument);

router.get('/:id', getDocumentById);

router.put('/:id', updateDocument);

router.delete('/:id', deleteDocument);

router.post('/:id/share', shareDocument);

router.get('/:id/versions', getVersions); 

router.post('/:id/versions', createVersion); 

router.delete('/:docId/versions/:versionId', deleteVersion); 

export default router;
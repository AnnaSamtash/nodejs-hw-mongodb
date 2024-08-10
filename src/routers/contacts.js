import { Router } from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
  upsertContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:id', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContact),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContact));

router.put(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContact),
);

router.patch(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);

export default router;

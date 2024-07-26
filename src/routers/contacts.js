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

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContact),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);

export default router;

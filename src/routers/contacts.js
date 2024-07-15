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

const router = Router();

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', ctrlWrapper(getContactById));

router.post('/', ctrlWrapper(createContact));

router.delete('/:contactId', ctrlWrapper(deleteContact));

router.put('/:contactId', ctrlWrapper(upsertContact));

router.patch('/:contactId', ctrlWrapper(patchContact));

export default router;

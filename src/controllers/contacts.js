import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactService,
  getAllContactsService,
  getContactByIdService,
  updateContactService,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContactsService({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactByIdService(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const userId = req.user._id;

  const contact = await createContactService({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContactService(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const upsertContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const result = await updateContactService(contactId, userId, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.contact,
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const result = await updateContactService(contactId, userId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

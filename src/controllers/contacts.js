import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactService,
  getAllContactsService,
  getContactByIdService,
  updateContactService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  const contacts = await getAllContactsService();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  const contact = await createContactService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContactService(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const upsertContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContactService(contactId, req.body, {
    upsert: true,
  });

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.contact,
  });
};

export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContactService(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

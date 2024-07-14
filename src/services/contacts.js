import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContactsService = () => ContactsCollection.find();

export const getContactByIdService = (contactId) =>
  ContactsCollection.findById(contactId);

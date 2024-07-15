import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContactsService = () => ContactsCollection.find();

export const getContactByIdService = (contactId) =>
  ContactsCollection.findById(contactId);

export const createContactService = (payload) =>
  ContactsCollection.create(payload);

export const deleteContactService = (contactId) =>
  ContactsCollection.findOneAndDelete({ _id: contactId });

export const updateContactService = async (
  contactId,
  payload,
  options = {},
) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!result || !result.value) return null;

  return {
    contact: result.value,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};

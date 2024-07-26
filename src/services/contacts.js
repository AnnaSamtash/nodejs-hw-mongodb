import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContactsService = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // const contactsCount = await ContactsCollection.find()
  //   .merge(contactQuery)
  //   .countDocuments();

  // const contacts = await contactQuery
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find({ userId }).merge(contactQuery).countDocuments(),
    contactQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactByIdService = (contactId, userId) =>
  ContactsCollection.findOne({ _id: contactId, userId });

export const createContactService = (payload) =>
  ContactsCollection.create(payload);

export const deleteContactService = (contactId, userId) =>
  ContactsCollection.findOneAndDelete({ _id: contactId, userId });

export const updateContactService = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
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

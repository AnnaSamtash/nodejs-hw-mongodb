import {
  getAllContactsService,
  getContactByIdService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

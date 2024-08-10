import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must have at least {#limit} characters',
    'string.max': 'Name cannot exceed {#limit} characters',
    'any.required': 'Name is a required field',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{12}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in the format +380XXXXXXXXX',
      'any.required': 'Phone number is a required field',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be "work", "home", or "personal"',
      'any.required': 'Contact type is a required field',
    }),
  photo: Joi.string(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must have at least {#limit} characters',
    'string.max': 'Name cannot exceed {#limit} characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{12}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in the format +380XXXXXXXXX',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be "work", "home", or "personal"',
  }),
  photo: Joi.string(),
});

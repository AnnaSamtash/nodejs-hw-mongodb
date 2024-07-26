import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must have at least {#limit} characters',
    'string.max': 'Name cannot exceed {#limit} characters',
    'any.required': 'Name is a required field',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be exactly 10 characters long and contain only letters and numbers',
      'any.required': 'Password is a required field',
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be exactly 10 characters long and contain only letters and numbers',
      'any.required': 'Password is a required field',
    }),
});

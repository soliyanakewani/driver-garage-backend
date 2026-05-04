import { body } from 'express-validator';

export const garageRequestOtpValidator = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
];

export const garageVerifyOtpValidator = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('code').isString().trim().matches(/^\d{6}$/).withMessage('code must be 6 digits'),
];

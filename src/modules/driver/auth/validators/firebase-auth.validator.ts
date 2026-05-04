import { body } from 'express-validator';

export const driverFirebaseAuthValidator = [
  body('idToken').isString().trim().notEmpty().withMessage('idToken is required'),
  body('firstName').isString().trim().notEmpty().withMessage('firstName is required'),
  body('lastName').isString().trim().notEmpty().withMessage('lastName is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password')
    .optional({ values: 'falsy' })
    .isString()
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters when provided'),
];

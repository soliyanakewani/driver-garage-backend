import { param, query } from 'express-validator';

export const garageIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid garage ID'),
];

export const searchQueryValidator = [
  query('q')
    .isString()
    .notEmpty()
    .withMessage('Search query is required'),
];
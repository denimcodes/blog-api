/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000, // 1 minute time window for request limiting
  limit: 60, // Allow maximun of 60 requests per window per limit
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error:
      'You have sent too many requests in a given amount of time. Please try again later.',
  },
});

export default limiter;
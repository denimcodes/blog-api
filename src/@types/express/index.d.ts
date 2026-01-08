/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Types } from 'mongoose';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId;
    }
  }
}

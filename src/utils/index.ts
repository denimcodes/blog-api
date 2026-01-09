/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

export const genUsername = () => {
  return `user_${Math.random().toString(36).substring(2, 9)}`;
};

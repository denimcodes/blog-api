/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

export const genUsername = () => {
  return `user_${Math.random().toString(36).substring(2, 9)}`;
};

export const  generateSlug = (title: string) => {
  const slug = title
    .toLowerCase() // normalize case
    .trim() // remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
  
  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;
  
  return uniqueSlug;
}

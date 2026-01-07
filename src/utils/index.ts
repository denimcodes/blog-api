export const genUsername = () => {
  return `user_${Math.random().toString(36).substring(2, 9)}`;
};

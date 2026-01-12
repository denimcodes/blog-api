"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.genUsername = void 0;
const genUsername = () => {
    return `user_${Math.random().toString(36).substring(2, 9)}`;
};
exports.genUsername = genUsername;
const generateSlug = (title) => {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    const randomChars = Math.random().toString(36).slice(2);
    const uniqueSlug = `${slug}-${randomChars}`;
    return uniqueSlug;
};
exports.generateSlug = generateSlug;

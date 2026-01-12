"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLength: [180, 'Title must be less than 180 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: [true, 'Slug must be unique'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    banner: {
        publicId: {
            type: String,
            required: [true, 'Banner public id is required'],
        },
        url: {
            type: String,
            required: [true, 'Banner url is required'],
        },
        width: {
            type: Number,
            required: [true, 'Banner width is required'],
        },
        height: {
            type: Number,
            required: [true, 'Banner height is required'],
        },
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        message: '{VALUE} is not suppored',
        default: 'draft',
    },
}, { timestamps: true });
blogSchema.pre('validate', function () {
    if (this.title && !this.slug) {
        this.slug = (0, utils_1.generateSlug)(this.title);
    }
});
exports.default = (0, mongoose_1.model)('Blog', blogSchema);

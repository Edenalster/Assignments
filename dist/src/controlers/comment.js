"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_model_1 = __importDefault(require("../models/comments_model"));
//const postModel = require("../models/posts_model");
const base_controller_1 = __importDefault(require("./base_controller"));
const commentController = (0, base_controller_1.default)(comments_model_1.default);
exports.default = commentController;
//# sourceMappingURL=comment.js.map
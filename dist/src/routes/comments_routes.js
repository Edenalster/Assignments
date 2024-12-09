"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_1 = __importDefault(require("../controlers/comment"));
router.get("/", comment_1.default.getAll.bind(comment_1.default));
router.get("/:id", (req, res) => {
    comment_1.default.getById(req, res);
});
router.post("/", comment_1.default.create.bind(comment_1.default));
router.put("/:id", (req, res) => {
    comment_1.default.update(req, res);
});
router.delete("/:id", (req, res) => {
    comment_1.default.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=comments_routes.js.map
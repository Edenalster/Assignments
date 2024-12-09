"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const comments_model_1 = __importDefault(require("../models/comments_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield comments_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
let commentId = "";
const testComment = {
    comment: "Test comment",
    author: "Eden",
    postId: "675432f21f130013144623ce",
};
const invalidComment = {
    comment: "Test comment",
};
describe("comments test suite", () => {
    test("comment test get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("Test adding new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.author).toBe(testComment.author);
        expect(response.body.postId).toBe(testComment.postId);
        commentId = response.body._id;
    }));
    test("Test adding invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    }));
    test("Test getting all comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Test get comment by author", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?author=" + testComment.author);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].author).toBe(testComment.author);
    }));
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("Test get comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/vgfre456789yctyv");
        expect(response.statusCode).toBe(400);
    }));
    test("Test update comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/comments/" + commentId).send({ comment: "New comment" });
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe("New comment");
    }));
    test("Test update comment fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/comments/" + commentId + 5).send({ comment: "New comment" });
        expect(response.statusCode).toBe(400);
    }));
    test("Test delete comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
    }));
    test("Test delete comment fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comment/" + commentId);
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map
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
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield posts_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
let postId = "";
const testPost = {
    title: "Test post",
    content: "Test content",
    sender: "Eden",
};
const invalidPost = {
    title: "Test post",
    content: "Test content",
};
describe("posts test suite", () => {
    test("Post test get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("Test adding new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(testPost);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.sender).toBe(testPost.sender);
        postId = response.body._id;
    }));
    test("Test adding invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(invalidPost);
        expect(response.status).not.toBe(201);
    }));
    test("Test getting all posts after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Test get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    }));
    test("Test get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Test get post by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/cfgvhbjii908765433");
        expect(response.statusCode).toBe(400);
    }));
    test("Test update post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/posts/" + postId).send({ title: "New title" });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("New title");
    }));
    test("Test update post fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/posts/" + postId + 5).send({ title: "New title" });
        expect(response.statusCode).toBe(400);
    }));
    test("Test delete post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(200);
    }));
    test("Test delete post fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map
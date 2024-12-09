import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;

beforeAll(async () =>{
    app= await initApp();
    console.log('beforeAll');
    await postModel.deleteMany();
});

afterAll(async() =>{ 
    console.log('afterAll');
    await mongoose.connection.close();    
});

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
    test("Post test get all posts", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test adding new post", async () => {
        const response = await request(app).post("/posts").send(testPost);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.sender).toBe(testPost.sender);
        postId = response.body._id;
    });

    test("Test adding invalid post", async () => {
        const response = await request(app).post("/posts").send(invalidPost);
        expect(response.status).not.toBe(201);
    });

    test("Test getting all posts after adding", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Test get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    });

    test("Test get post by id", async () => {
        const response = await request(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Test get post by id fail", async () => {
        const response = await request(app).get("/posts/cfgvhbjii908765433");
        expect(response.statusCode).toBe(400);
    });

    test("Test update post", async () => {
        const response = await request(app).put("/posts/"+postId).send({title: "New title"});
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("New title");
    });

    test("Test update post fail", async () => {
        const response = await request(app).put("/posts/"+postId+5).send({title: "New title"});
        expect(response.statusCode).toBe(400);
    });

    test("Test delete post", async () => {
        const response = await request(app).delete("/posts/"+postId);
        expect(response.statusCode).toBe(200);
    });

    test("Test delete post fail", async () => {
        const response = await request(app).delete("/posts/"+postId);
        expect(response.statusCode).toBe(404);
    });


}); 



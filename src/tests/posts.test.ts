import request from "supertest";
import initApp from"../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app:Express;

type User ={
    email: string;
    password: string;
    token?: string;
    _id?: string;
};

const testUser : User= {
    email: "test@user.com",
    password: "123456",
}
let accessToken : string;

let postId = "";
const testPost={
    title: "Test title",
    content: "Test content",
    sender: "Eden"
};

beforeAll(async ()=>{
    app= await initApp();
    await postModel.deleteMany();
    await userModel.deleteMany();
    const response = await request(app).post("/auth/register").send(testUser);
    const response2 = await request(app).post("/auth/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    accessToken = response2.body.accessToken;
    testPost.sender = response2.body.id;
});

afterAll(async ()=>{
   await mongoose.connection.close();
});

const invalidPost={
    content: "Test content",
};

const invalidUpdate={
    title: "New title",
};

describe("Posts test suite", () => {
    test("Post test get all posts ", async () => {
       const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test adding new post", async () => {
        const response = await request(app).post("/posts").set({authorization: "JWT " + accessToken}).send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        postId = response.body._id;
      });

    test("Test adding invalid post", async () => {
        const response = await request(app).post("/posts").set({
            authorization: "JWT" + accessToken,
        }).send(invalidPost);
        expect(response.statusCode).not.toBe(201);
    });

    test("Test get all posts after adding", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Test get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + testPost.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testPost.sender);
    });

    test("Test get post by id", async () => {
        const response = await request(app).get("/posts/"+postId);
        const post = response.body;
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    });

    test("Test get post by id fail", async () => {
        const response = await request(app).get("/posts/" + postId + "3");
        expect(response.statusCode).toBe(400);
    });

    test("Test update post", async () => {
        const response = await request(app).put("/posts/" + postId).set({ authorization: "JWT " + accessToken, }).send({
            title: "New title",
            content: "New content",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("New title");
        expect(response.body.content).toBe("New content");
    });

    test("Test update post fail", async () => {
        const response = await request(app).put("/posts/" + postId + "3").set({authorization: "JWT " + accessToken, }).send({ invalidUpdate });
        expect(response.statusCode).toBe(400);
    }
    );

    test("Test delete post", async () => {
        const response = await request(app).delete("/posts/" + postId).set({ authorization: "JWT " + accessToken });
        expect(response.statusCode).toBe(200);
    }
    );

    test("Test delete post fail", async () => {
        const response = await request(app).delete("/posts/" + postId + "3").set ({ authorization: "JWT " + accessToken });
        expect(response.statusCode).toBe(400);
    }
    );
});




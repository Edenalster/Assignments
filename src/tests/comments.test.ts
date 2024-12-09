import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import { Express } from "express";

let app: Express;


beforeAll(async () =>{
    app= await initApp();
    console.log('beforeAll');
    await commentModel.deleteMany();
});

afterAll(async() =>{ 
    console.log('afterAll');
    await mongoose.connection.close();    
});

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
    test("comment test get all comments", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test adding new comment", async () => {
        const response = await request(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.author).toBe(testComment.author);
        expect(response.body.postId).toBe(testComment.postId);
        commentId=response.body._id;
    });

    test("Test adding invalid comment", async () => {
        const response = await request(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    });

    test("Test getting all comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Test get comment by author", async () => {
        const response = await request(app).get("/comments?author=" + testComment.author);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].author).toBe(testComment.author);
    });

    test("Test get comment by id", async () => {
        const response = await request(app).get("/comments/" +commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    });

    test("Test get comment by id fail", async () => {
        const response = await request(app).get("/comments/vgfre456789yctyv");
        expect(response.statusCode).toBe(400);
    });

    test("Test update comment", async () => {
        const response = await request(app).put("/comments/"+ commentId).send({comment: "New comment"});
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe("New comment");
    });

    test("Test update comment fail", async () => {
        const response = await request(app).put("/comments/"+commentId+5).send({comment: "New comment"});
        expect(response.statusCode).toBe(400);
    });

    test("Test delete comment", async () => {
        const response = await request(app).delete("/comments/"+commentId);
        expect(response.statusCode).toBe(200);
    });

    test("Test delete comment fail", async () => {
        const response = await request(app).delete("/comment/"+commentId);
        expect(response.statusCode).toBe(404);
    });


}); 



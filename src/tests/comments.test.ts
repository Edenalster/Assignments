import { iComment } from './../models/comments_model';
import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import { Express } from "express";
import userModel from "../models/user_model";


let app: Express;

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

const testComment = {
    comment: "Test comment",
    sender: "Eden",
    postId: "first comment",
};

const invalidUpdate = {
    comment: "Test comment",
};


beforeAll(async () =>{
    app= await initApp();
    console.log('beforeAll');
    await commentModel.deleteMany();
    await userModel.deleteMany();
    const response = await request(app).post("/auth/register").send(testUser);
    const response2 = await request(app).post("/auth/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    accessToken = response2.body.accessToken;
    testComment.sender = response2.body.id;

});

afterAll(async() =>{ 
    console.log('afterAll');
    await mongoose.connection.close();    
});

let commentId = "";


const invalidComment = {
    comment: "Test comment",
};

describe("comments test suite", () => {
    test("comment test get all comments", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test Create Comment", async () => {
        const response = await request(app).post("/comments").set({authorization: "JWT " + accessToken}).send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        commentId = response.body._id;
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

    test("Test get comment by sender", async () => {
        const response = await request(app).get("/comments?senderr=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testComment.sender);
    });

    test("Test get comment by id", async () => {
        const response = await request(app).get("/comments/"+ commentId);
        const post = response.body;
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    });

    test("Test get comment by id fail", async () => {
        const response = await request(app).get("/comments/" + commentId + "3");
        expect(response.statusCode).toBe(400);
    });

    test("Test update comment", async () => {
        const response = await request(app).put("/comments/"+ commentId).set({ authorization: "JWT " + accessToken, }).send({
            comment: "New comment",
            postId: "New comment",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe("New comment");
        expect(response.body.postId).toBe("New comment");
    });

    test("Test update comment fail", async () => {
        const response = await request(app).put("/comments/"+commentId+5).set({authorization: "JWT " + accessToken, }).send({ invalidUpdate });
        expect(response.statusCode).toBe(400);
    });

    test("Test delete comment", async () => {
        const response = await request(app).delete("/comments/"+commentId).set({ authorization: "JWT " + accessToken });;
        expect(response.statusCode).toBe(200);
    });

    test("Test delete comment fail", async () => {
        const response = await request(app).delete("/comment/"+commentId +3).set({ authorization: "JWT " + accessToken });;
        expect(response.statusCode).toBe(404);
    });


}); 


import express from "express";
const router = express.Router();
import commentController from "../controlers/comment";

router.get("/", commentController.getAll.bind(commentController));

router.get("/:id", (req, res) => {
    commentController.getById(req, res)
});

router.post("/",commentController.create.bind(commentController));

router.put("/:id", (req, res) => {
    commentController.update(req, res)
});

router.delete("/:id", (req, res) => {
    commentController.delete(req, res)
}); 

export default router;
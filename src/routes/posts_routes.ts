import express from "express";
const router = express.Router();
import postController from "../controlers/post";

router.get("/", postController.getAll.bind(postController));

router.get("/:id", (req, res) => {
    postController.getById(req, res)
});

router.post("/",postController.create.bind(postController));

router.put("/:id", (req, res) => {
    postController.update(req, res)
});

router.delete("/:id",(req, res) => {
    postController.delete(req, res)
});

export default router;
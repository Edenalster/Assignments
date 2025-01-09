import postModel, {iPost} from "../models/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class postController extends BaseController<iPost> {
    constructor(){
        super(postModel);
    }

    async createItem(req: Request, res: Response) {
        const userId = req.params.userId;
        const post = {
            ...req.body,
            sender: userId
        }
        req.body = post;
        super.createItem(req, res);
    };
            
}

export default new postController(); 




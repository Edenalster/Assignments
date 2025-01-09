import commentsModel, {iComment} from "../models/comments_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";


class commentController extends BaseController<iComment> {
    constructor(){
        super(commentsModel);
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


export default new commentController(); 




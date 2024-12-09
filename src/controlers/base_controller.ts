import { Request,Response } from "express";
import { Model } from "mongoose";

class BaseController<T>{
    model: Model<T>;
    constructor(model: Model<T>){
        this.model = model;
    }

    async getAll  (req: Request, res: Response,) {
        const ownerFilter = req.query.owner; 
        try{
            if(ownerFilter){
                const posts = await this.model.find({owner: ownerFilter});
                res.status(200).send(posts);
            }else {
                const posts= await this.model.find();
                res.status(200).send(posts);
            }    
        }catch(error){
            res.status(400).send(error);
        }
    };
    
    async getById (req: Request,res: Response) {
        const postId= req.params.id;
        try{
            const post = await this.model.findById(postId);
                if(post== null){
                    return res.status(404).send({message: "Post not found"});
                }else {
                    return res.status(200).send(post);
                }
        }catch(error){
            res.status(400).send(error);
        }
    
    };
    
    async create (req: Request,res: Response){
        const post = req.body;
        try{
            const newPost = await this.model.create(post);
            res.status(201).send(newPost);
        }catch(error){
            res.status(400).send(error);
    
        }
    
    };

    async update (req: Request,res: Response){
        const postId = req.params.id;
        const post = req.body;
        try{
            const updatedPost = await this.model.findByIdAndUpdate (postId, post, {new: true});
            if(updatedPost == null){
                return res.status(404).send({message: "Post not found"});
            } else {
                res.status(200).send(updatedPost);
            } 
        }catch(error){
            res.status(400).send(error);
        }
    };

    async delete (req: Request,res: Response){
        const postId = req.params.id;
        try{
            const deletedPost = await this.model.findByIdAndDelete(postId);
            if(deletedPost == null){
                return res.status(404).send({message: "Post not found"});
            }else{
                res.status(200).send(deletedPost);
            }
        }catch(error){
            res.status(400).send(error);
        }
    };
   
}

const createController = <T>(model: Model<T>) => {
    return new BaseController(model);
}

export default createController;
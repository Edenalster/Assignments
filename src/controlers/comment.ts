import commentModel, {iComment} from "../models/comments_model";
//const postModel = require("../models/posts_model");
import createController from "./base_controller";

const commentController = createController(commentModel);

export default commentController;

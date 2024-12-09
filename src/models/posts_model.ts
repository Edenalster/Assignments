import  mongoose from "mongoose";

export interface iPost{
    title: 'string';
    content: 'string';
    sender: 'string';

}

const postSchema = new mongoose.Schema<iPost>({
    title: {
        type: String,
        required:true,
    },
    content: String,
    sender: {
        type: String,
        required:true,
    },
});

const postModel = mongoose.model<iPost>("Post", postSchema);

export default postModel;
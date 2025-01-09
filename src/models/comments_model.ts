import mongoose from "mongoose";

export interface iComment {
    comment: 'string';
    sender: 'string';
    postId: 'string';
}


const commentSchema = new mongoose.Schema<iComment>({
    comment: {
        type: String,
        required:true,
    },
    sender: {
        type: String,
        required:true,
    },
    postId: {
        type: String,
        required: true,
    }
});

const commentModel = mongoose.model<iComment>("Comment", commentSchema);

export default commentModel;
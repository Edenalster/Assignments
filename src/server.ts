import express ,{Express} from "express";
const app = express();
import dotenv from "dotenv"
dotenv.config(); 
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoutes from "./routes/posts_routes";
import commentRoutes from "./routes/comments_routes";


const initApp = async () => {
    return new Promise <Express> ((resolve, reject) => {
        const db = mongoose.connection;
        db.on("error", (error)=> console.error(error));
        db.once("open", ()=> console.log("Connected to Database"));

        if (process.env.DB_CONNECTION === undefined){
            console.error("DB_CONNECTION is not defined");
            reject();
        }else{
            mongoose.connect(process.env.DB_CONNECTION).then(() => {
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));
    
    
                app.use("/posts", postRoutes);
                app.use("/comments", commentRoutes);
    
                app.get("/about", (req, res) => {
                    res.send("About page");
                });
                resolve(app);
    
            });

        }   
 });
   
};

export default initApp;
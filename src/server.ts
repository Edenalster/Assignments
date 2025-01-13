import express , {Express} from "express";
const app = express();
import dotenv from "dotenv"; 
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoutes from "./routes/posts_routes";
import commentRoutes from "./routes/comments_routes";
import authRoutes from "./routes/auth_routes"; 
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"; 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);

const options = {
    definition: {
    openapi: "3.0.0",
    info: {
    title: "Web Dev 2025 REST API",
    version: "1.0.0",
    description: "REST server including authentication using JWT",
    },
    servers: [{url: "http://localhost:" + process.env.PORT, },],
    },
    apis: ["./src/routes/*.ts"],
    };
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = async ()=> {
    return new Promise<Express>((resolve, reject)=>{
        const db = mongoose.connection;
        db.on("error", (error)=> console.error(error));
        db.once("open",()=> {console.log("Connected to Database");});

        if (process.env.DB_CONNECTION === undefined){
            console.error("DB_CONNECTION is not defined");
            reject();
        } else {
            mongoose.connect(process.env.DB_CONNECTION).then(()=>{
                
               
                resolve(app);
            });
        }   
 }); 
};

export default initApp;




// VERSION 1
// const initApp = (done) => {
//     const db = mongoose.connection;
//     db.on("error", (error)=> console.error(error));
//     db.once("open", ()=> console.log("Connected to Database"));

//     mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        
//         const bodyParser = require("body-parser");
//         app.use(bodyParser.json());
//         app.use(bodyParser.urlencoded({ extended: true }));
        
        
//         const postRoutes = require("./routes/posts_routes");
//         app.use("/posts", postRoutes);
        
//         app.get("/about", (req, res)=>{
//             res.send("About page");
//         });
//         done(app);
//     });

   
// };
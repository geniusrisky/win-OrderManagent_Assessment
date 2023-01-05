/**
 * 
 * @file initilize the express application
 * 
 */
import express  from "express";
import dotenv from "dotenv";
import process from "node:process"
import session from "express-session"

import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import publicV1APIs from "./api/public/index.js";

import logger from "./logger/logger.js";
import MongoDBConnection from "./utils/db/mongodb.connection.js";
import errorMiddleware from "./utils/httpErrorHandlerMiddleware.js"


dotenv.config({ silent: process.env });

export default class App {
   app;
   port;
   mongoDbConnection;

  constructor(port) { 
    this.app = express();
    this.port = port;
    this.mongoDbConnection = new MongoDBConnection(process.env.MONGO_URL);
    this.initializeMiddlewares();
    this.initializeAPIs();
    this.initializeErrorHandling();
    this.echo();
  }

    initializeAPIs(){
    this.app.use("/public", publicV1APIs);
}
   initializeErrorHandling() {
    this.app.use(errorMiddleware);
  } 

   initializeMiddlewares() {
     
     this.app.use(cookieParser());
     this.app.enable("trust proxy");
     this.app.use(bodyParser.json());
     
 
     morgan.token("time", () => Date().toString());
     this.app.use(morgan("[:time] :remote-addr :method :url :status :res[content-length] :response-time ms"));
     this.app.use(helmet());
     this.app.use(session({
      secret: "secret",
      resave: false ,
      saveUninitialized: true ,
    }))
    
  }




  


  echo(){
    this.app.get("/version", (req, res) => {
      res.status(200).send({ "orderManagement": process.env.npm_package_version });
    });
    this.app.get("/:ping", (req, res) => {
      if (req.params.ping === "ping") {
        res.status(200).send({
          ping: "pong",
        });
      } else {
        res.status(400).send({ message: "Invalid Request" });
      }
    });
  }

   listen() {
    this.app.listen(this.port, () => {
      logger.debug(`Server Started At Port ${this.port}`);
    });
  }
}
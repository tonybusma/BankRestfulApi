if (process.env.NODE_ENV !== 'production') require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Controller from "./controllers/Controller";

class App {
  public app: express.Application;

  public constructor(controllers: Controller[]) {
    this.app = express();

    this.app.use(cors());
    this.app.use(express.json());
    this.initControllers(controllers);
    this.initMongoose();
    this.connectMongo();
  }

  private initMongoose(): void {
    mongoose.set("runValidators", true);
  }

  private connectMongo(): void {
    mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`
    );
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public startListening(port: Number): void {
    this.app.listen(port, () => {
      console.log(`App running on port: ${port}`);
    });
  }
}

export default App;

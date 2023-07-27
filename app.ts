import express, {Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import menuRouter from "./src/router/menu";
import authRouter from "./src/router/Auth";
import cartRouter from "./src/router/Cart";
import orderRouter from "./src/router/Orders";



require("dotenv").config();
const app = express();

// Connect to MongoDB

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

mongoose
  .connect(mongodbUri)
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.error(error));

app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: `
    Welcome to Food App!
    
    `,
  });
});

app.use("/api", menuRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

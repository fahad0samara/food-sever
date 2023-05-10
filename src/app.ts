import express, {Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import menuRouter from "./router/menu";
import authRouter from "./router/Auth";
import cartRouter from "./router/Cart";

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://fahad:fahad@cluster.zwkjqce.mongodb.net/back-end-helthe",
    {
      useUnifiedTopology: true,
    } as any
  )
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.error(error));

app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api", menuRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);


const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const app = express();
const Menu = require("./router/menu");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://fahad:fahad@cluster.zwkjqce.mongodb.net/back-end-helthe",
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error: any) => console.error(error));

app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());

app.get("/", (req: any, res: {json: (arg0: {message: string}) => void}) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api", Menu.default);



const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

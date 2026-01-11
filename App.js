import express from "express";
import cors from "cors";
import AuthRoute from "./routes/Auth.js";
import Task_OP from "./routes/Operation.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Just for testing");
});

app.use("/Auth", AuthRoute);
app.use("/task", Task_OP);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoutes";
import workSpaceRouter from "./routes/workspaceRoutes";
import widgetRouter from "./routes/widgetRouters";
import sourceRouter from "./routes/sourceRouter";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

app.use("/auth", authRouter);
app.use("/workspace", workSpaceRouter);
app.use("/widget", widgetRouter);
app.use("/source", sourceRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app.listen(PORT || 8000, () =>
  console.log(`Server running on port ${PORT || 8000}`)
);

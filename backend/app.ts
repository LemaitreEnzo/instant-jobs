import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import organizationsRoutes from "routes/organizations.routes";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(helmet());
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});

app.use("/organizations", organizationsRoutes)

export default app;

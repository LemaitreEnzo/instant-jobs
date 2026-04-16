import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import organizationsRoutes from "routes/organizations.routes";
import getEnv from "./utils/envHelper";

const app = express();

const VERSION = getEnv("VERSION");

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(helmet());
app.get(`/${VERSION}`, (req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});

app.use(express.json())

app.use(`/${VERSION}/organizations`, organizationsRoutes)

export default app;

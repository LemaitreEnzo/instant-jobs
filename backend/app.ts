import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import campusRoutes from "routes/campus.routes";
import organizationsRoutes from "routes/organizations.routes";
import promotionsRoutes from "routes/promotions.routes";
import specialitiesRoutes from "routes/specialities.routes";
import subSpecialitiesRoutes from "routes/subSpecialities.routes";
import getEnv from "./utils/envHelper";

const app = express();

const VERSION = getEnv("VERSION");

app.use(helmet());

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get(`/${VERSION}`, (req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});

app.use(`/${VERSION}/organization`, organizationsRoutes);

app.use(`/${VERSION}/campus`, campusRoutes);

app.use(`/${VERSION}/promotion`, promotionsRoutes);

app.use(`/${VERSION}/speciality`, specialitiesRoutes);

app.use(`/${VERSION}/sub-speciality`, subSpecialitiesRoutes);

export default app;

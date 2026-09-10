import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import getEnv from "./utils/envHelper"

import campusRoutes from "routes/campus.routes";
import organizationsRoutes from "routes/organizations.routes";
import promotionsRoutes from "routes/promotions.routes";
import specialitiesRoutes from "routes/specialities.routes";
import subSpecialitiesRoutes from "routes/subSpecialities.routes";
import usersRoutes from "src/routes/users.routes";
import mediasRoutes from "src/routes/medias.routes";
import applicationsRoutes from "src/routes/applications.routes";

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

app.use(`/${VERSION}/user`, usersRoutes);

app.use(`/${VERSION}/campus`, campusRoutes);

app.use(`/${VERSION}/promotion`, promotionsRoutes);

app.use(`/${VERSION}/speciality`, specialitiesRoutes);

app.use(`/${VERSION}/sub-speciality`, subSpecialitiesRoutes);

app.use(`/${VERSION}/media`, mediasRoutes);

app.use(`/${VERSION}/application`, applicationsRoutes);

export default app;

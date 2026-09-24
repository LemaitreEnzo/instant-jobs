import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import getEnv from "./utils/envHelper";

import campusRoutes from "src/routes/campus.route";
import organizationsRoutes from "src/routes/organization.route";
import promotionsRoutes from "src/routes/promotion.route";
import specialitiesRoutes from "src/routes/speciality.route";
import subSpecialitiesRoutes from "src/routes/subSpeciality.route";
import applicationsRoutes from "src/routes/application.route";
import appointmentsRoutes from "src/routes/appointment.route";
import mediasRoutes from "src/routes/media.route";
import usersRoutes from "src/routes/user.route";

const app = express();

const VERSION = getEnv("VERSION");

app.use(helmet());

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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

app.use(`/${VERSION}/appointment`, appointmentsRoutes);

export default app;

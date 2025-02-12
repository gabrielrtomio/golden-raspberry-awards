import { Express, Router } from "express";
import { adaptRoute } from "./adapt-route";
import { LoadAwardsIntervalsController } from "@/controllers/LoadAwardsIntervalsController";

export const setupRoutes = (api: Express) => {
  const awardsRouter = Router();
  awardsRouter.get(
    "/awards/intervals",
    adaptRoute(new LoadAwardsIntervalsController())
  );
  api.use("/api", awardsRouter);
};

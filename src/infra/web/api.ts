import express from "express";
import { json } from "body-parser";
import { setupRoutes } from "./setup-routes";

const api = express();
api.use(json());
setupRoutes(api);

export default api;

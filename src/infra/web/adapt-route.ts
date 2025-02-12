import { Controller } from "@/core/controllers/Controller";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const data = { ...req.query, ...req.params, ...req.body };
      const result = await controller.handle(data);
      res.status(200).send(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      res.status(500).json([{ code: "unexpected_error", message }]);
    }
  };
};

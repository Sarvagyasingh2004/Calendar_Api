import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface HttpError extends Error {
  status?: number;
}

const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err.stack || err.message);

  res.status(err.status ?? 500).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;

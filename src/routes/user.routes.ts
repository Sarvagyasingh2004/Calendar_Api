import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  getUserByIdController,
} from "../modules/user/index/user.controller";
import { sensitiveEndpointsLimiter } from "../middlewares/basicRateLimiter.middleware";

const router = Router();

router.post(
  "/",
  sensitiveEndpointsLimiter(50, 15 * 60 * 1000),
  registerUserController,
);
router.post(
  "/login",
  sensitiveEndpointsLimiter(50, 15 * 60 * 1000),
  loginUserController,
);
router.get("/:id", getUserByIdController);

export default router;

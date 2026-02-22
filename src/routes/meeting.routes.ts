import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createMeetingController,
  deleteMeetingController,
  getMeetingByIdController,
  getMeetingsController,
  updateMeetingController,
} from "../modules/meeting/index/meeting.controller";
import { sensitiveEndpointsLimiter } from "../middlewares/basicRateLimiter.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getMeetingsController);
router.get("/:id", getMeetingByIdController);

router.post(
  "/",
  sensitiveEndpointsLimiter(20, 60 * 1000),
  createMeetingController,
);
router.put(
  "/:id",
  sensitiveEndpointsLimiter(20, 60 * 1000),
  updateMeetingController,
);
router.delete(
  "/:id",
  sensitiveEndpointsLimiter(20, 60 * 1000),
  deleteMeetingController,
);

export default router;

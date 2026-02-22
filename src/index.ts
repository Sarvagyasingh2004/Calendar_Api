require("dotenv").config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./utils/logger";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import errorHandler from "./middlewares/errorHandler";
import userRoutes from "./routes/user.routes";
import meetingRoutes from "./routes/meeting.routes";
import sequelize, { connectDB } from "./config/database";
import "./config/models";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${JSON.stringify(req.body)}`);
  next();
});

app.use((req, res, next) => {
  const ip = req.ip ?? req.headers["x-forwarded-for"]?.toString() ?? "unknown";
  try {
    rateLimiter.consume(ip).then(() => next());
  } catch (error) {
    logger.warn(`Rate limit exceeded for IP:${req.ip}`, error);
    res.status(429).json({
      success: false,
      message: "Too many requests",
    });
  }
});

app.use("/users", userRoutes);
app.use("/meetings", meetingRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    logger.info("Database synced");

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", error);
    process.exit(1);
  }
};

startServer();

import { Sequelize } from "sequelize";
import { logger } from "../utils/logger";
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  logging: (msg) => logger.debug(msg),
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");
  } catch (error) {
    logger.error("Unable to connect to the database", {
      error,
    });
    process.exit(1);
  }
};

export default sequelize;

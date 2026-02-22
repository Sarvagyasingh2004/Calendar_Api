import { logger } from "../../../utils/logger";
import { LoginUserDto } from "../dto/login-user.dto";
import { RegisterUserDto } from "../dto/register-user.dto";
import { registerUser, loginUser, getUserById } from "../service/user.service";
import { Response, Request } from "express";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { value, error } = RegisterUserDto(req.body);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid payload";

      logger.warn("Validation error", { message });

      return res.status(400).json({
        success: false,
        message,
      });
    }
    const result = await registerUser(value);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || "Registration failed",
    });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { value, error } = LoginUserDto(req.body);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid payload";

      logger.warn("Validation error", { message });

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const result = await loginUser(value);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await getUserById({ id });

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

import { Response } from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../service/meeting.service";
import { AuthenticatedRequest } from "../../../middlewares/auth.middleware";
import { logger } from "../../../utils/logger";
import { CreateMeetingDto } from "../dto/create-meeting.dto";
import { UpdateMeetingDto } from "../dto/update-meeting.dto";

export const createMeetingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { value, error } = CreateMeetingDto(req.body);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid payload";

      logger.warn("Validation error", { message });

      return res.status(400).json({
        success: false,
        message,
      });
    }
    const meeting = await createMeeting({
      userId: req.user!.id,
      startTime: value.startTime,
      endTime: value.endTime,
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (error: any) {
    if (error.message === "TIME_CONFLICT") {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMeetingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { startTime, endTime, page, limit } = req.query;

  const meetings = await getMeetings({
    userId: req.user!.id,
    startTime: startTime ? new Date(startTime as string) : undefined,
    endTime: endTime ? new Date(endTime as string) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.status(200).json({ success: true, data: meetings });
};

export const getMeetingByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const meeting = await getMeetingById({
      userId: req.user!.id,
      meetingId: Number(req.params.id),
    });

    res.status(200).json({ success: true, data: meeting });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateMeetingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { value, error } = UpdateMeetingDto(req.body);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid payload";

      logger.warn("Validation error", { message });

      return res.status(400).json({
        success: false,
        message,
      });
    }
    const meeting = await updateMeeting({
      meetingId: Number(req.params.id),
      userId: req.user!.id,
      startTime: value.startTime,
      endTime: value.endTime,
    });

    res.status(200).json({ success: true, data: meeting });
  } catch (error: any) {
    if (error.message === "TIME_CONFLICT") {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked",
      });
    }

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteMeetingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    await deleteMeeting({
      userId: req.user!.id,
      meetingId: Number(req.params.id),
    });

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully.",
    });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

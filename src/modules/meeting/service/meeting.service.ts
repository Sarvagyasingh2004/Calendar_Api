import { Op } from "sequelize";
import { Meeting } from "../module/meeting.model";
import {
  CreateMeetingInterface,
  GetMeetingByIdInterface,
  GetMeetingsInterface,
  MeetingResponse,
  PaginatedMeetingsResponse,
  UpdateMeetingInterface,
} from "../interface/meeting.interface";
import {
  deleteByPattern,
  deleteCache,
  getCache,
  setCache,
} from "../../../utils/cache";

export const createMeeting = async (
  payload: CreateMeetingInterface,
): Promise<MeetingResponse> => {
  const { userId, startTime, endTime } = payload;
  const conflict = await Meeting.findOne({
    where: {
      userId,
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime },
    },
  });
  if (conflict) {
    throw new Error("TIME_CONFLICT");
  }

  const meeting = await Meeting.create({
    userId,
    startTime,
    endTime,
  });

  await deleteByPattern(`meetings:user:${userId}*`);

  return {
    id: meeting.id,
    userId: meeting.userId,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
  };
};

export const getMeetings = async (
  payload: GetMeetingsInterface,
): Promise<PaginatedMeetingsResponse> => {
  const { userId, startTime, endTime, page = 1, limit = 10 } = payload;

  const offset = (page - 1) * limit;

  const isFiltered = Boolean(startTime || endTime);

  const cacheKey = `meetings:user:${userId}:page:${page}:limit:${limit}`;

  if (!isFiltered) {
    const cached = await getCache<PaginatedMeetingsResponse>(cacheKey);
    if (cached) return cached;
  }

  const where: Record<string, unknown> = { userId };

  if (startTime && endTime) {
    where.startTime = { [Op.gte]: startTime };
    where.endTime = { [Op.lte]: endTime };
  }

  const { rows, count } = await Meeting.findAndCountAll({
    where,
    limit,
    offset,
    order: [["startTime", "ASC"]],
  });

  const response: PaginatedMeetingsResponse = {
    data: rows.map((meeting) => ({
      id: meeting.id,
      userId: meeting.userId,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    })),
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };

  if (!isFiltered) {
    await setCache(cacheKey, response);
  }
  return response;
};

export const getMeetingById = async (
  payload: GetMeetingByIdInterface,
): Promise<MeetingResponse> => {
  const { meetingId, userId } = payload;

  const cacheKey = `meeting:${meetingId}:user:${userId}`;

  const cached = await getCache<MeetingResponse>(cacheKey);
  if (cached) return cached;

  const meeting = await Meeting.findOne({
    where: { id: meetingId, userId },
  });

  if (!meeting) {
    throw new Error("NOT_FOUND");
  }

  const response = {
    id: meeting.id,
    userId: meeting.userId,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
  };

  await setCache(cacheKey, response);
  return response;
};

export const updateMeeting = async (
  payload: UpdateMeetingInterface,
): Promise<MeetingResponse> => {
  const { meetingId, userId, startTime, endTime } = payload;

  const meeting = await Meeting.findOne({
    where: { id: meetingId, userId },
  });

  if (!meeting) {
    throw new Error("NOT_FOUND");
  }

  const conflict = await Meeting.findOne({
    where: {
      userId,
      id: { [Op.ne]: meetingId },
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime },
    },
  });

  if (conflict) {
    throw new Error("TIME_CONFLICT");
  }

  meeting.startTime = startTime;
  meeting.endTime = endTime;
  await meeting.save();

  await deleteByPattern(`meetings:user:${userId}*`);
  await deleteCache(`meeting:${meetingId}:user:${userId}`);

  return {
    id: meeting.id,
    userId: meeting.userId,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
  };
};

export const deleteMeeting = async (payload: GetMeetingByIdInterface) => {
  const { meetingId, userId } = payload;

  const meeting = await Meeting.findOne({
    where: { id: meetingId, userId },
  });

  if (!meeting) {
    throw new Error("NOT_FOUND");
  }

  await meeting.destroy();

  await deleteByPattern(`meetings:user:${userId}*`);
  await deleteCache(`meeting:${meetingId}:user:${userId}`);
};

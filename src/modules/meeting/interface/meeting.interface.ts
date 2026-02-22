export interface CreateMeetingInterface {
  userId: number;
  startTime: Date;
  endTime: Date;
}

export interface UpdateMeetingInterface {
  meetingId: number;
  userId: number;
  startTime: Date;
  endTime: Date;
}

export interface GetMeetingsInterface {
  userId: number;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedMeetingsResponse {
  data: MeetingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetMeetingByIdInterface {
  userId: number;
  meetingId: number;
}

export interface MeetingResponse {
  id: number;
  userId: number;
  startTime: Date;
  endTime: Date;
}

import joi from "joi";
import { CreateMeetingInterface } from "../interface/meeting.interface";

export const CreateMeetingDto = (data: CreateMeetingInterface) => {
  const schema = joi.object({
    startTime: joi.date().iso().required().messages({
      "date.base": "startTime must be a valid date",
      "date.format": "startTime must be in ISO format",
      "any.required": "startTime is required",
    }),

    endTime: joi
      .date()
      .iso()
      .greater(joi.ref("startTime"))
      .required()
      .messages({
        "date.base": "endTime must be a valid date",
        "date.format": "endTime must be in ISO format",
        "date.greater": "endTime must be greater than startTime",
        "any.required": "endTime is required",
      }),
  });
  return schema.validate(data);
};

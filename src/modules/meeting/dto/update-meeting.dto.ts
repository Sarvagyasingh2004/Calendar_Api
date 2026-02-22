import joi from "joi";
import { UpdateMeetingInterface } from "../interface/meeting.interface";

export const UpdateMeetingDto = (data: UpdateMeetingInterface) => {
  const schema = joi.object({
    startTime: joi.date().iso().required().messages({
      "date.base": "startTime must be a valid date",
      "any.required": "startTime is required",
    }),

    endTime: joi
      .date()
      .iso()
      .greater(joi.ref("startTime"))
      .required()
      .messages({
        "date.base": "endTime must be a valid date",
        "date.greater": "endTime must be greater than startTime",
        "any.required": "endTime is required",
      }),
  });
  return schema.validate(data);
};

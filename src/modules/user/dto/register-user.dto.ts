import joi from "joi";
import { RegisterUserInterface } from "../interface/user.interface";

export const RegisterUserDto = (data: RegisterUserInterface) => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};


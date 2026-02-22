import joi from "joi";
import { LoginUserInterface } from "../interface/user.interface";

export const LoginUserDto = (data: LoginUserInterface) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};


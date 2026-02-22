import bcrypt from "bcrypt";
import { User } from "../module/user.model";
import { generateToken } from "../../../utils/jwt";
import {
  GetUserByIdInterface,
  LoginUserInterface,
  RegisterUserInterface,
  RegisterUserResponse,
  LoginUserResponse,
} from "../interface/user.interface";

const SALT_ROUNDS = 10;

export const registerUser = async (
  payload: RegisterUserInterface,
): Promise<RegisterUserResponse> => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (
  payload: LoginUserInterface,
): Promise<LoginUserResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

export const getUserById = async (payload: GetUserByIdInterface) => {
  const { id } = payload;
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface RegisterUserInterface {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInterface {
  email: string;
  password: string;
}

export interface GetUserByIdInterface {
  id: number;
}

export interface RegisterUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface LoginUserResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

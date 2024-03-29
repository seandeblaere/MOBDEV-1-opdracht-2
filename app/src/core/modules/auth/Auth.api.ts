import { API } from "../../network/api";
import { Auth, RegisterUser, User } from "./Auth.types";

type LoginBody = {
  email: string;
  password: string;
};

export const login = (body: LoginBody) => {
  return API.post<Auth>("/login", body);
};

export const register = (body: RegisterUser) => {
  return API.post<RegisterUser>("/register", body);
};

export const getCurrentUser = () => {
  return API.get<User>("/users/current");
};

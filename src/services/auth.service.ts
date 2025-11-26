import api from "./api";

export const register = (fullName: string, email: string, password: string) =>
  api.post("/auth/register", { fullName, email, password }).then(res => res.data);

interface LoginPayload {
  email: string;
  password?: string;
  otp?: string;
}

export const login = (payload: LoginPayload) =>
  api.post("/auth/login", payload).then(res => res.data);

export const requestOtp = (email: string) =>
  api.post("/auth/otp/request", { email }).then(res => res.data);
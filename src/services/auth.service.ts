import api from "./api";

export const register = (fullName: string, email: string, password: string) =>
  api.post("/auth/register", { fullName, email, password }).then(res => res.data);

export const loginWithOtp = (email: string, otp: string) =>
  api.post("/auth/login", { email, otp }).then(res => res.data);

export const requestOtp = (email: string) =>
  api.post("/auth/otp/request", { email }).then(res => res.data);

import { createAction } from "@reduxjs/toolkit";

export const login = createAction<{ userLogin: string; password: string }>(
  "/WebAppDev_front/auth/login"
);
export const logout = createAction("/WebAppDev_front/auth/logout");

export const register = createAction<{ userName: string;
   email: string; password: string }>(
  "/WebAppDev_front/auth/register"
);
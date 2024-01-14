import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "/api";

export const login = createAsyncThunk(
  "/WebAppDev_front/auth/login",
  async ({ userLogin, password }: { userLogin: string; password: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        userLogin,
        password,
      });

      if (response.status === 200) {
        console.log('200')
        return { userLogin }; // Возвращаем данные о пользователе
      } else {
        console.log('error 500')
        throw new Error("Authentication failed");
      }
    } catch (error) {
        console.log('REER')
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "/WebAppDev_front/auth/register",
  async ({ userName,email,password }: {userName: string;
    email: string; password: string}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        userName,
        email,
        password,
      });

      if (response.status === 200) {
        return { email };
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      throw error;
    }
  }
);
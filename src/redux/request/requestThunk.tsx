import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "/api";

import { getAllRequestsSuccess } from "./requestSlice";

export const getRequestDetails = createAsyncThunk(
  "/WebAppDev_front/requests/getRequestDetails",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fossil/${id}`);
      dispatch(getAllRequestsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteDraftRequest = createAsyncThunk(
  "/WebAppDev_front/requests/deleteRequest",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/fossil/${id}/delete`);
      dispatch(getAllRequestsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const formRequest = createAsyncThunk(
  "/WebAppDev_front/requests/formRequest",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.put(`/fossil/${id}/status/user`);
      dispatch(getAllRequestsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateSpecies = createAsyncThunk(
  "/WebAppDev_front/requests/updateSpecies",
  async (
    { id, flight_number }: { id: string; flight_number: string },
    { dispatch }
  ) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/fossil/${id}/update`, {
        flight_number,
      });
      dispatch(getAllRequestsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// Асинхронный action creator для получения данных о заявках
export const getAllRequests  = createAsyncThunk('/WebAppDev_front/requests', async (filters, { getState }) => {
  try {
    // Используйте getState() для доступа к текущему состоянию Redux и извлечения фильтров

    const response = await axios.get(`${API_BASE_URL}/fossil`, { params: filters });
    // Верните полученные данные
    return response.data;
  } catch (error) {
    // Обработка ошибок, например, запись ошибки в состояние
    throw error;
  }
});
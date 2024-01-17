import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "/api";

import { getAllFossilsSuccess } from "./fossilSlice";

export const getFossilDetails = createAsyncThunk(
  "/WebAppDev_front/fossils/getFossilDetails",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fossil/${id}`);
      dispatch(getAllFossilsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteDraftFossil = createAsyncThunk(
  "/WebAppDev_front/fossils/deleteFossil",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/fossil/${id}/delete`);
      dispatch(getAllFossilsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const formFossil = createAsyncThunk(
  "/WebAppDev_front/fossils/formFossil",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.put(`/fossil/${id}/status/user`);
      dispatch(getAllFossilsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateSpecies = createAsyncThunk(
  "/WebAppDev_front/fossils/updateSpecies",
  async (
    { id, flight_number }: { id: string; flight_number: string },
    { dispatch }
  ) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/fossil/${id}/update`, {
        flight_number,
      });
      dispatch(getAllFossilsSuccess(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// Асинхронный action creator для получения данных о заявках
export const getAllFossils  = createAsyncThunk('/WebAppDev_front/fossils', async (filters, { getState }) => {
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
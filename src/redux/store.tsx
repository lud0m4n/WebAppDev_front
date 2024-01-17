// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authMiddleware from "./auth/authMiddleware";
import fossilsMiddleware from "./fossil/fossilMiddleware";
import authReducer from "./auth/authSlice";
import fossilReducer from "./fossil/fossilSlice"; // Добавили этот импорт
import {filterAndActiveIdReducer} from "./filterAndActiveFossilID/reducers"
import { fossilFilterReducer } from "./fossilFilters/reducers";

const store = configureStore({
  reducer: {
    auth: authReducer,
    fossil: fossilReducer,
    filterAndActiveId: filterAndActiveIdReducer,
    fossilFilters: fossilFilterReducer,
    // Добавьте другие редюсеры, если необходимо
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }).concat(authMiddleware, fossilsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
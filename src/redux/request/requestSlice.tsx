import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequestState {
  fossils: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RequestState = {
  fossils: [],
  status: "idle",
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    getAllRequestsStart: (state) => {
      state.status = "loading";
    },
    getAllRequestsSuccess: (state, action: PayloadAction<{fossils: any[]}>) => {
      state.status = "succeeded";
      state.fossils = action.payload.fossils;
    },
    getAllRequestsFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { getAllRequestsStart, getAllRequestsSuccess, getAllRequestsFailure } = requestSlice.actions;
export default requestSlice.reducer;
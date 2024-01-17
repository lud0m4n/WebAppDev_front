import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FossilState {
  fossils: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: FossilState = {
  fossils: [],
  status: "idle",
};

const fossilSlice = createSlice({
  name: "fossil",
  initialState,
  reducers: {
    getAllFossilsStart: (state) => {
      state.status = "loading";
    },
    getAllFossilsSuccess: (state, action: PayloadAction<{fossils: any[]}>) => {
      state.status = "succeeded";
      state.fossils = action.payload.fossils;
    },
    getAllFossilsFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { getAllFossilsStart, getAllFossilsSuccess, getAllFossilsFailure } = fossilSlice.actions;
export default fossilSlice.reducer;
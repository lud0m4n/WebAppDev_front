import { RootState } from "../store";

export const selectFossils = (state: RootState) => state.fossil.fossils;
export const selectFossilsStatus = (state: RootState) => state.fossil.status;
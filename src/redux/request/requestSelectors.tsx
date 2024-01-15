import { RootState } from "../store";

export const selectRequests = (state: RootState) => state.request.fossils;
export const selectRequestsStatus = (state: RootState) => state.request.status;
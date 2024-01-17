import { Middleware } from "redux";
import { getAllFossilsStart, getAllFossilsSuccess, getAllFossilsFailure } from "./fossilSlice";
import { getAllFossils } from "./fossilActions";
import axios from "axios";

const API_BASE_URL = "/api";

const fossilsMiddleware: Middleware = (store) => (next) => async (action) => {
  if (getAllFossils.match(action)) {
    try {
      store.dispatch(getAllFossilsStart());

      const response = await axios.get(`${API_BASE_URL}/fossil/`, {
        headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
        },
    });

      if (response.status === 200) {
        store.dispatch(getAllFossilsSuccess(response.data));
      } else {
        store.dispatch(getAllFossilsFailure());
      }
    } catch (error) {
      console.log('Error during getAllFossils');
      console.error("Error during getAllFossils:", error);
      store.dispatch(getAllFossilsFailure());
      throw error;
    }
  }

  return next(action);
};

export default fossilsMiddleware;
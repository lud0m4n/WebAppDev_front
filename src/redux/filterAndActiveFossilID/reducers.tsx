// reducers.ts

import { combineReducers, AnyAction } from 'redux';
import {
  SET_ACTIVE_REQUEST_ID,
  SET_NAME_FILTER,
  SET_NUM_OF_PROD_IN_REQ,
} from './actions';

const activeFossilIDReducer = (state: number | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_ACTIVE_REQUEST_ID:
      return action.payload;
    default:
      return state;
  }
};

const searchNameFilterReducer = (state: string | '' = '', action: AnyAction) => {
  switch (action.type) {
    case SET_NAME_FILTER:
      return action.payload;
    default:
      return state;
  }
};

const numOfPeriodsReducer = (state: number | 0 = 0, action: AnyAction) => {
  switch (action.type) {
    case SET_NUM_OF_PROD_IN_REQ:
      return action.payload;
    default:
      return state;
  }
};

export const filterAndActiveIdReducer = combineReducers({
  activeFossilID: activeFossilIDReducer,
  searchNameFilter: searchNameFilterReducer,
  numOfPeriods: numOfPeriodsReducer,
});

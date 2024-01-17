export const SET_ACTIVE_REQUEST_ID = 'SET_ACTIVE_REQUEST_ID';
export const SET_MAX_PRICE_FILTER = 'SET_MAX_PRICE_FILTER';
export const SET_NUM_OF_PROD_IN_REQ = 'SET_Num_OF_PROD_IN_REQ';

export const setActiveFossilID = (activeFossilID: number) => ({
  type: SET_ACTIVE_REQUEST_ID,
  payload: activeFossilID,
});

export const setSearchNameFilter = (searchName: string | '') => ({
  type: SET_MAX_PRICE_FILTER,
  payload: searchName,
});

export const setNumOfProdInReq = (numOfProdInReq: number | 0) => ({
  type: SET_NUM_OF_PROD_IN_REQ,
  payload: numOfProdInReq,
});
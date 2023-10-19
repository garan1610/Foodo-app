import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type LoadingState = {
  isLoading: boolean;
};

const initialState: LoadingState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavourite: (state: any, action: PayloadAction<any>) => {
      state = [...state, action.payload];
    },
  },
});

export const addFavourite = loadingSlice.actions.addFavourite;

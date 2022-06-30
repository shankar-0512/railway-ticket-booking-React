import { createSlice } from "@reduxjs/toolkit";

const userInputSlice = createSlice({
  name: "userInput",
  initialState: {
    from: null,
    to: null,
    journeyDate: null,
    class: null,
  },
  reducers: {
    UpdateUserInputs(state, action) {
      state.from = action.payload.from;
      state.to = action.payload.to;
      state.journeyDate = action.payload.journeyDate;
      state.class = action.payload.class;
    },
  },
});

export const userInputActions = userInputSlice.actions;
export default userInputSlice;

import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    isAuthenticated: false,
    userId: null,
  },
  reducers: {
    LoginStateHandler(state) {
      state.isAuthenticated = !state.isAuthenticated;
    },
    UpdateUserId(state, action){
      state.userId = action.payload;
    }
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;

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
      console.log("isauth :" + state.isAuthenticated);
    },
    UpdateUserId(state, action){
      state.userId = action.payload;
      console.log("userId :" + state.userId);
    }
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;

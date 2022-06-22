import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./login-slice";
import userInputsSlice from "./userInputsSlice";

const store = configureStore({
  reducer: { login: loginSlice.reducer, user: userInputsSlice.reducer },
});

export default store;

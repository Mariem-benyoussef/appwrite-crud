// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

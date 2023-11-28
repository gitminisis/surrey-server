import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import easyLoadBoxReducer from "./easyLoadBoxSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    easyLoadBox: easyLoadBoxReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
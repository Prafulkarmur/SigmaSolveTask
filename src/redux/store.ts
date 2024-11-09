import { configureStore } from "@reduxjs/toolkit";
import category from "./feature/Category/category"

export const store = configureStore({
  reducer: {
    // priceRange: priceRangeReducer,
    category:category
  },
  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

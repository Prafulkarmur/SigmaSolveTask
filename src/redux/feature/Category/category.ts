// categorySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categories: string[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<string>) => {
      state.categories.push(action.payload);
    },
  },
});

export const { addCategory } = categorySlice.actions;

export const selectCategories = (state: { category: CategoryState }) => state.category.categories;

export default categorySlice.reducer;

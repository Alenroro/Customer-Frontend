import { createSlice } from '@reduxjs/toolkit';

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState: null,
  reducers: {
    setSelectedCategory: (state, action) => action.payload,
  },
});

export const { setSelectedCategory } = selectedCategorySlice.actions;

export default selectedCategorySlice.reducer;

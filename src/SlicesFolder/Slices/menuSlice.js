import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUrls: [],
  categoryImages: [],
  foodItemImages: [],
  updatedItems: [],
  orderedFood: [],
  loading: true,
  showBottomNavbar: false,
  selectedTable: null,
  additionalItems: [],
  selectedCombos: {},
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setImageUrls(state, action) {
      state.imageUrls = action.payload;
    },
    setSelectedTable(state, action) {
      state.selectedTable = action.payload;
    },
    setCategoryImages(state, action) {
      state.categoryImages = action.payload;
    },
    setFoodItemImages(state, action) {
      state.foodItemImages = action.payload;
    },
    setUpdatedItems(state, action) {
      state.updatedItems = action.payload;
      const orderedItems = action.payload.filter((item) => item.count > 0);
      state.orderedFood = orderedItems;
      state.showBottomNavbar = orderedItems.length > 0;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setOrderedFood(state, action) {
      state.orderedFood = action.payload;
      state.showBottomNavbar = action.payload.length > 0;
    },
    updateCartItemCount(state, action) {
      const { name, delta } = action.payload;
      state.updatedItems = state.updatedItems.map((item) =>
        item.name === name
          ? { ...item, count: Math.max(0, item.count + delta) }
          : item
      );
      const orderedItems = state.updatedItems.filter((item) => item.count > 0);
      state.orderedFood = orderedItems;
      state.showBottomNavbar = orderedItems.length > 0;
    },
    setAdditionalItems: (state, action) => {
      state.additionalItems = action.payload;
    },
    addCombo(state, action) {
      const combo = action.payload;
      const existingCombo = state.selectedCombos[combo._id];

      if (existingCombo) {
        state.selectedCombos[combo._id].count += 1;
      } else {
        state.selectedCombos[combo._id] = {
          ...combo,
          count: 1,
          status: "Not Served",
        };
      }

      const comboItems = Object.values(state.selectedCombos).map((combo) => ({
        _id: combo._id,
        name: combo.comboName,
        count: combo.count,
        categoryName: combo.comboCategoryName,
        type: combo.comboType,
        price: combo.comboPrice,
        items: combo.comboItems,
        tableNumber: state.selectedTable || null,
        isCombo: true,
      }));

      const regularItems = state.orderedFood.filter((item) => !item.isCombo);
      state.orderedFood = [...regularItems, ...comboItems];
      state.showBottomNavbar = state.orderedFood.length > 0;
    },
    removeCombo(state, action) {
      const comboId = action.payload;
      const existingCombo = state.selectedCombos[comboId];

      if (existingCombo) {
        if (existingCombo.count > 1) {
          state.selectedCombos[comboId].count -= 1;
        } else {
          delete state.selectedCombos[comboId];
        }
      }

      const comboItems = Object.values(state.selectedCombos).map((combo) => ({
        _id: combo._id,
        name: combo.comboName,
        count: combo.count,
        categoryName: combo.comboCategoryName,
        type: combo.comboType,
        price: combo.comboPrice,
        items: combo.comboItems,
        tableNumber: state.selectedTable || null,
        isCombo: true,
      }));

      const regularItems = state.orderedFood.filter((item) => !item.isCombo);
      state.orderedFood = [...regularItems, ...comboItems];
      state.showBottomNavbar = state.orderedFood.length > 0;
    },
  },
});

export const {
  setImageUrls,
  setSelectedTable,
  setCategoryImages,
  setFoodItemImages,
  setUpdatedItems,
  setLoading,
  updateCartItemCount,
  setAdditionalItems,
  setOrderedFood,
  addCombo,
  removeCombo,
} = menuSlice.actions;

export default menuSlice.reducer;
 
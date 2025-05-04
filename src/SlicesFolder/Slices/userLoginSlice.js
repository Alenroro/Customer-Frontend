import { createSlice } from '@reduxjs/toolkit';

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: {
    phoneNumber: '',
    name: '',
    isLogin: false,
  },
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { setPhoneNumber, setName, setIsLogin } = userLoginSlice.actions;
export default userLoginSlice.reducer;

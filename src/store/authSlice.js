import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};
// need to create post slice after project completion
// to check if the user is logged in or not
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // actions== functions
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

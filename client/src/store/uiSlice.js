import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.loginModalOpen = true;
    },

    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal } = uiSlice.actions;

export default uiSlice.reducer;

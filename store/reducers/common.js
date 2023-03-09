import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isBiometricEnabled: false,
  hasBiometricRecord: false,
  isBiometricSupported: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setBiometricStatus: (state, action) => {
      state.isBiometricEnabled = action.payload;
    },

    setBiometricSupport: (state, action) => {
      state.isBiometricSupported = action.payload;
    },

    setBiometricRecord: (state, action) => {
      state.hasBiometricRecord = action.payload;
    },

    setAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setBiometricStatus,
  setBiometricSupport,
  setBiometricRecord,
  setAuthenticationStatus,
} = commonSlice.actions;

export default commonSlice.reducer;

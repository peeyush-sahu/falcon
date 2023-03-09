import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyName: "",
  details: {},
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyCode: (state, action) => {
      state.companyName = action.payload.companyName;
    },

    setCompanyDetails: (state, action) => {
      state.details = action.payload.details;
      state.companyName = action.payload.companyName;
    },
  },
});

export const { setCompanyDetails, setCompanyCode } = companySlice.actions;

export default companySlice.reducer;

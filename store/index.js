import { configureStore } from "@reduxjs/toolkit";

import commonReducer from "./reducers/common";
import companyReducer from "./reducers/company";

const store = configureStore({
  reducer: {
    common: commonReducer,
    company: companyReducer
  },
});

export default store;

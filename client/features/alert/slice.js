import { createSlice } from "redux-starter-kit";

const alertSlice = createSlice({
  slice: "alert",
  initialState: { currentAlert: null },
  reducers: {
    alert(state, action) {
      state.currentAlert = action.payload;
    }
  }
});

export default alertSlice;
export const alertActions = alertSlice.actions;

import { createSlice } from "redux-starter-kit";

const debugSlice = createSlice({
  slice: "debug",
  initialState: false,
  reducers: {
    setDebug(state, action) {
      return action.payload;
    }
  }
});

export default debugSlice;
export const debugActions = debugSlice.actions;

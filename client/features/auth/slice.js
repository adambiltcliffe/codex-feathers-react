import { createSlice } from "redux-starter-kit";

const authSlice = createSlice({
  slice: "auth",
  initialState: { pendingLogin: false, pendingLogout: false, user: null },
  reducers: {
    reauthenticate(state, action) {
      state.pendingLogin = true;
    },
    reauthenticate_success(state, action) {
      state.pendingLogin = false;
      state.user = action.payload.user;
    },
    reauthenticate_failure(state, action) {
      state.pendingLogin = false;
      state.user = null;
    },
    authenticate(state, action) {
      state.pendingLogin = true;
    },
    authenticate_success(state, action) {
      state.pendingLogin = false;
      state.user = action.payload.user;
    },
    authenticate_failure(state, action) {
      state.pendingLogin = false;
      state.user = null;
    },
    logout(state, action) {
      state.pendingLogout = true;
    },
    logout_success(state, action) {
      state.pendingLogout = false;
      state.user = null;
    },
    logout_failure(state, action) {
      state.pendingLogout = false;
    }
  }
});

export default authSlice;
export const authActions = authSlice.actions;

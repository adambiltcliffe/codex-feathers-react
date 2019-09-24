import { createSlice } from "redux-starter-kit";

const authSlice = createSlice({
  slice: "auth",
  initialState: { pendingLogin: false, pendingLogout: false, user: null },
  reducers: {
    reauthenticate(state, action) {
      state.pendingLogin = true;
    },
    reauthenticateSuccess(state, action) {
      state.pendingLogin = false;
      state.user = action.payload.user;
    },
    reauthenticateFailure(state, action) {
      state.pendingLogin = false;
      state.user = null;
    },
    authenticate(state, action) {
      state.pendingLogin = true;
    },
    authenticateSuccess(state, action) {
      state.pendingLogin = false;
      state.user = action.payload.user;
    },
    authenticateFailure(state, action) {
      state.pendingLogin = false;
      state.user = null;
    },
    logout(state, action) {
      state.pendingLogout = true;
    },
    logoutSuccess(state, action) {
      state.pendingLogout = false;
      state.user = null;
    },
    logoutFailure(state, action) {
      state.pendingLogout = false;
    }
  }
});

export default authSlice;
export const authActions = authSlice.actions;

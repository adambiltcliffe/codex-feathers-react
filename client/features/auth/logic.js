import { createLogic } from "redux-logic";

import authSlice from "./slice";
import alertSlice from "../alert/slice";

const reauthLogic = createLogic({
  type: authSlice.actions.reauthenticate,
  cancelType: authSlice.actions.logout,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: authSlice.actions.reauthenticateSuccess,
    failType: authSlice.actions.reauthenticateFailure
  },
  process({ getState, action, client }) {
    return client.reAuthenticate();
  }
});

const signupLogic = createLogic({
  type: authSlice.actions.signup,
  latest: true,
  warnTimeout: 1000,
  process({ getState, action, client }, dispatch, done) {
    const { username, password, email } = action.payload;
    return client
      .service("users")
      .create({ username, password, email })
      .then(result => {
        dispatch(authSlice.actions.signupSuccess(result));
        dispatch(
          authSlice.actions.authenticate({
            username,
            password
          })
        );
      })
      .catch(err => dispatch(authSlice.actions.signupFailure(err)))
      .then(() => done());
  }
});

const authLogic = createLogic({
  type: authSlice.actions.authenticate,
  cancelType: authSlice.actions.logout,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: authSlice.actions.authenticateSuccess,
    failType: authSlice.actions.authenticateFailure
  },
  process({ getState, action, client }) {
    const { username, password } = action.payload;
    return client.authenticate({
      strategy: "local",
      username,
      password
    });
  }
});

const logoutLogic = createLogic({
  type: authSlice.actions.logout,
  cancelType: [
    authSlice.actions.reauthenticate,
    authSlice.actions.authenticate
  ],
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: authSlice.actions.logoutSuccess,
    failType: authSlice.actions.logoutFailure
  },
  process({ getState, action, client }) {
    return client.logout();
  }
});

const authLogics = [reauthLogic, signupLogic, authLogic, logoutLogic];

export default authLogics;

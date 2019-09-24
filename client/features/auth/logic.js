import { createLogic } from "redux-logic";

import authSlice from "./slice";

const reauthLogic = createLogic({
  type: authSlice.actions.reauthenticate,
  cancelType: authSlice.actions.logout,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: authSlice.actions.reauthenticate_success,
    failType: authSlice.actions.reauthenticate_failure
  },
  process({ getState, action, client }) {
    return client.reAuthenticate();
  }
});

const authLogic = createLogic({
  type: authSlice.actions.authenticate,
  cancelType: authSlice.actions.logout,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: authSlice.actions.authenticate_success,
    failType: authSlice.actions.authenticate_failure
  },
  process({ getState, action, client }) {
    return client.authenticate({
      strategy: "local",
      email: "alf@example.com",
      password: "alf1"
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
    successType: authSlice.actions.logout_success,
    failType: authSlice.actions.logout_failure
  },
  process({ getState, action, client }) {
    return client.logout();
  }
});

const authLogics = [reauthLogic, authLogic, logoutLogic];

export default authLogics;

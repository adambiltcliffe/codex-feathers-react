import { createLogic } from "redux-logic";

import authLogics from "./features/auth/logic";
import lobbyLogics from "./features/lobby/logic";
import gameLogics from "./features/game/logic";

import { alertActions } from "./features/alert/slice";

const errors = require("@feathersjs/errors");

function getCounter() {
  let value = 0;
  return () => {
    value++;
    return value;
  };
}
const nextSerial = getCounter();

const feathersErrorLogic = createLogic({
  type: "*",
  transform({ getState, action }, next) {
    // First make sure that if the entire payload is a JS Error
    // (error=true) or a FeathersError, move it into payload.error
    if (
      action.payload &&
      !action.payload.error &&
      (action.error || action.payload.type == "FeathersError")
    ) {
      action.payload = { error: action.payload };
    }
    // Make sure action.error is set if payload contains error
    if (action.payload && action.payload.error) {
      action.error = true;
      // JSONify FeathersErrors because otherwise Redux complains
      if (action.payload.error.type == "FeathersError") {
        action.payload.error = action.payload.error.toJSON();
      } else {
        action.payload.error = new errors.GeneralError(
          action.payload.error
        ).toJSON();
      }
    }
    next(action);
  },
  process({ getState, action }, dispatch, done) {
    if (action.error) {
      dispatch(
        alertActions.alert({
          message: action.payload.error.message,
          timestamp: Date.now(),
          serial: nextSerial()
        })
      );
    }
    done();
  }
});

const logics = [
  ...authLogics,
  ...lobbyLogics,
  ...gameLogics,
  feathersErrorLogic
];

export default logics;

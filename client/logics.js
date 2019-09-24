import { createLogic } from "redux-logic";

import authLogics from "./features/auth/logic";
import lobbyLogics from "./features/lobby/logic";

const feathersErrorLogic = createLogic({
  type: "*",
  transform({ getState, action }, next) {
    if (action.payload && action.payload.type == "FeathersError") {
      action.error = true;
      action.payload = action.payload.toJSON();
    }
    next(action);
  }
});

const logics = [...authLogics, ...lobbyLogics, feathersErrorLogic];

export default logics;

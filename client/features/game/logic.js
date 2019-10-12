import { createLogic } from "redux-logic";

import gameSlice from "./slice";

const openLogic = createLogic({
  type: gameSlice.actions.openGame,
  cancelType: gameSlice.actions.closeGame,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: gameSlice.actions.openGameSuccess,
    failType: gameSlice.actions.openGameFailure
  },
  process({ getState, action, client }) {
    return client.service("games").get(action.payload);
  }
});

const gameLogics = [openLogic];

export default gameLogics;

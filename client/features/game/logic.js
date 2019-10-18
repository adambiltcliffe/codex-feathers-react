import { paramsForServer } from "feathers-hooks-common";
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
    return client
      .service("games")
      .get(action.payload, paramsForServer({ includeSteps: true }));
  }
});

const actLogic = createLogic({
  type: gameSlice.actions.act,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: gameSlice.actions.actSuccess,
    failType: gameSlice.actions.actFailure
  },
  process({ getState, action, client }) {
    const gameState = getState().game;
    const index = Object.values(gameState.current.steps).length;
    return client
      .service("steps")
      .create({ game: gameState.current._id, index, action: action.payload });
  }
});

const gameLogics = [openLogic, actLogic];

export default gameLogics;

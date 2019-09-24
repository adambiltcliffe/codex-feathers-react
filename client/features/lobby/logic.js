import { createLogic } from "redux-logic";

import lobbySlice from "./slice";

const openLogic = createLogic({
  type: lobbySlice.actions.openLobby,
  cancelType: lobbySlice.actions.closeLobby,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: lobbySlice.actions.openLobbySuccess,
    failType: lobbySlice.actions.openLobbyFailure
  },
  process({ getState, action, client }) {
    return client.service("games").find();
  }
});

const lobbyLogics = [openLogic];

export default lobbyLogics;

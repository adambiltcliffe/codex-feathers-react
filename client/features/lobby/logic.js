import { createLogic } from "redux-logic";

import lobbySlice from "./slice";

import find from "lodash/find";

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

const newGameLogic = createLogic({
  type: lobbySlice.actions.createGame,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: lobbySlice.actions.createGameSuccess,
    failType: lobbySlice.actions.createGameFailure
  },
  process({ getState, action, client }) {
    return client.service("games").create({ comment: action.payload.comment });
  }
});

const joinLogic = createLogic({
  type: lobbySlice.actions.joinGame,
  process({ getState, action, client }, dispatch, done) {
    client
      .service("players")
      .create({ game: action.payload.gameId, seat: 1 })
      .then(() => {
        dispatch(lobbySlice.actions.joinGameSuccess());
        done();
      })
      .catch(error => {
        dispatch(
          lobbySlice.actions.joinGameFailure({
            error,
            gameId: action.payload.gameId
          })
        );
        done();
      });
  }
});

const leaveLogic = createLogic({
  type: lobbySlice.actions.leaveGame,
  process({ getState, action, client }, dispatch, done) {
    const state = getState();
    const game = state.lobby.games[action.payload.gameId];
    const playerEntry = find(game.players, p => p.user == state.auth.user._id);
    if (playerEntry === undefined) {
      throw new Error("Can't leave a game you're not playing.");
    }
    client
      .service("players")
      .remove(playerEntry._id)
      .then(() => {
        dispatch(lobbySlice.actions.leaveGameSuccess());
        done();
      })
      .catch(error => {
        dispatch(
          lobbySlice.actions.leaveGameFailure({
            error,
            gameId: action.payload.gameId
          })
        );
        done();
      });
  }
});

const setReadyLogic = null;

const lobbyLogics = [openLogic, newGameLogic, joinLogic, leaveLogic];

export default lobbyLogics;

import { createSlice } from "redux-starter-kit";

const lobbySlice = createSlice({
  slice: "lobby",
  initialState: { loading: false, open: false, games: null, selected: null },
  reducers: {
    openLobby(state, action) {
      state.loading = true;
    },
    openLobbySuccess(state, action) {
      state.loading = false;
      state.open = true;
      state.games = {};
      action.payload.forEach(g => {
        state.games[g._id] = g;
      });
    },
    openLobbyFailure(state, action) {
      state.loading = false;
      state.open = false;
      state.games = null;
    },
    closeLobby(state, action) {
      state.open = false;
      state.games = null;
    },
    createGame(state, action) {
      state.pendingCreate = true;
    },
    createGameSuccess(state, action) {
      state.pendingCreate = false;
      state.selected = action.payload._id;
    },
    createGameFailure(state, action) {
      state.pendingCreate = false;
    },
    deleteGame(state, action) {
      state.games[action.payload.gameId].pendingUpdate = true;
    },
    deleteGameSuccess(state, action) {
      delete state.games[action.payload.gameId];
    },
    deleteGameFailure(state, action) {
      state.games[action.payload.gameId].pendingUpdate = false;
    },
    joinGame(state, action) {
      state.games[action.payload.gameId].pendingUpdate = true;
    },
    joinGameSuccess(state, action) {
      // do nothing, just wait for the update
    },
    joinGameFailure(state, action) {
      state.games[action.payload.gameId].pendingUpdate = false;
    },
    leaveGame(state, action) {
      state.games[action.payload.gameId].pendingUpdate = true;
    },
    leaveGameSuccess(state, action) {
      // do nothing, just wait for the update
    },
    leaveGameFailure(state, action) {
      state.games[action.payload.gameId].pendingUpdate = false;
    },
    setReady(state, action) {
      state.games[action.payload.gameId].pendingUpdate = true;
    },
    setReadySuccess(state, action) {
      // do nothing, just wait for the update
    },
    setReadyFailure(state, action) {
      state.games[action.payload.gameId].pendingUpdate = false;
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
    onGameCreated(state, action) {
      if (!state.open) return;
      const currentGame = state.games[action.payload._id];
      if (
        currentGame === undefined ||
        currentGame.updatedAt < action.payload.updatedAt
      ) {
        state.games[action.payload._id] = action.payload;
      }
    },
    onGameChanged(state, action) {
      if (!state.open) return;
      const currentGame = state.games[action.payload._id];
      if (
        currentGame === undefined ||
        currentGame.updatedAt < action.payload.updatedAt
      ) {
        state.games[action.payload._id] = action.payload;
      }
    },
    onGameRemoved(state, action) {
      if (!state.open) return;
      delete state.games[action.payload._id];
    }
  }
});

export default lobbySlice;
export const lobbyActions = lobbySlice.actions;

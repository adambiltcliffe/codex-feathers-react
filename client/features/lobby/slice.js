import { createSlice } from "redux-starter-kit";

const lobbySlice = createSlice({
  slice: "lobby",
  initialState: { loading: false, open: false, games: null },
  reducers: {
    openLobby(state, action) {
      state.loading = true;
    },
    openLobbySuccess(state, action) {
      state.loading = false;
      state.open = true;
      state.games = action.payload;
    },
    openLobbyFailure(state, action) {
      state.loading = false;
      state.open = false;
      state.games = null;
      state.error = action.payload;
    },
    closeLobby(state, action) {
      state.open = false;
      state.games = null;
    }
  }
});

export default lobbySlice;
export const lobbyActions = lobbySlice.actions;

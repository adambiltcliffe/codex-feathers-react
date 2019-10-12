import { createSlice } from "redux-starter-kit";

const gameSlice = createSlice({
  slice: "game",
  initialState: {
    currentId: null,
    current: null,
    loaded: false,
    failed: false
  },
  reducers: {
    openGame(state, action) {
      state.currentId = action.gameId;
      state.current = null;
      state.loaded = false;
    },
    openGameSuccess(state, action) {
      state.current = action.payload;
      state.loaded = true;
    },
    openGameFailure(state, action) {
      state.currentId = null;
      state.failed = true;
    },
    closeGame(state, actions) {
      state.currentId = null;
      state.current = null;
      state.loaded = false;
      state.failed = false;
    }
  }
});

export default gameSlice;
export const gameActions = gameSlice.actions;

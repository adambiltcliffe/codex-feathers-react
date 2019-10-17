import { createSlice } from "redux-starter-kit";

import { authActions } from "../auth/slice";

import CodexGame from "@adam.biltcliffe/codex";

const gameSlice = createSlice({
  slice: "game",
  initialState: {
    current: null,
    states: null,
    loaded: false,
    failed: false,
    pendingAction: false
  },
  reducers: {
    openGame(state, action) {
      state.current = null;
      state.states = [];
      state.loaded = false;
    },
    openGameSuccess(state, action) {
      state.current = action.payload;
      state.loaded = true;
      while (
        state.current.steps[state.states.length.toString()] !== undefined
      ) {
        const index = state.states.length;
        const step = state.current.steps[index.toString()];
        const prevState =
          index == "0"
            ? state.current.startState
            : state.states[(index - 1).toString()];
        const newState = CodexGame.replayAction(
          prevState,
          step.action,
          step.newInfo
        );
        state.states.push(newState);
      }
    },
    openGameFailure(state, action) {
      state.failed = true;
    },
    closeGame(state, actions) {
      state.current = null;
      state.loaded = false;
      state.failed = false;
      state.states = null;
    },
    act(state, action) {
      state.pendingAction = true;
    },
    actSuccess(state, action) {
      state.pendingAction = false;
    },
    actFailure(state, action) {
      state.pendingAction = false;
    }
  },
  extraReducers: {
    [authActions.authenticate]: (state, action) => {
      state.current = null;
      state.loaded = false;
      state.failed = false;
      state.states = null;
    }
  }
});

export default gameSlice;
export const gameActions = gameSlice.actions;

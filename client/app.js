import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { Provider, useSelector } from "react-redux";
import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  createSlice
} from "redux-starter-kit";

import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";

import { createLogicMiddleware } from "redux-logic";
import logics from "./logics";

import authSlice, { authActions } from "./features/auth/slice";
import alertSlice, { alertActions } from "./features/alert/slice";
import lobbySlice, { lobbyActions } from "./features/lobby/slice";

import Lobby from "./ui/Lobby";

const client = feathers();
client.configure(socketio(io()));
client.configure(auth());

const frobSlice = createSlice({
  slice: "frob",
  initialState: false,
  reducers: {
    frob(state, action) {
      return true;
    },
    unfrob(state, action) {
      return false;
    }
  }
});

const rootReducer = combineReducers({
  alert: alertSlice.reducer,
  auth: authSlice.reducer,
  lobby: lobbySlice.reducer,
  frob: frobSlice.reducer
});
const logicMiddleware = createLogicMiddleware(logics, { client });
const store = configureStore({
  reducer: rootReducer,
  middleware: [logicMiddleware, ...getDefaultMiddleware({ thunk: false })]
});

client.service("games").on("created", (data, context) => {
  store.dispatch(lobbyActions.onGameCreated(data));
});
client.service("games").on("patched", (data, context) => {
  store.dispatch(lobbyActions.onGameChanged(data));
});

function TestComponent(props) {
  const user = useSelector(s => s.auth.user);
  const alert = useSelector(s => s.alert.currentAlert);
  useEffect(() => {
    store.dispatch(authActions.reauthenticate());
  }, []);
  return (
    <>
      <div>Hello, world!</div>
      {alert ? (
        <div>
          <strong>
            {alert.timestamp}: {alert.message}
          </strong>
        </div>
      ) : null}
      <button onClick={() => store.dispatch(frobSlice.actions.frob())}>
        Frob
      </button>
      <button onClick={() => store.dispatch(frobSlice.actions.unfrob())}>
        Unfrob
      </button>
      <button onClick={() => store.dispatch(authActions.authenticate("alf"))}>
        Log in (alf)
      </button>
      <button onClick={() => store.dispatch(authActions.authenticate("bob"))}>
        Log in (bob)
      </button>
      <button onClick={() => store.dispatch(authActions.logout())}>
        Log out
      </button>
      <div>User object is: {JSON.stringify(user)}</div>
      {user ? <Lobby /> : <></>}
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <TestComponent />
  </Provider>,
  document.getElementById("react-root")
);

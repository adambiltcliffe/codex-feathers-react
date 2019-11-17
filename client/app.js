import "react-bulma-components/dist/react-bulma-components.min.css";
import "./css/app.css";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Provider, useSelector } from "react-redux";
import {
  configureStore,
  getDefaultMiddleware,
  combineReducers
} from "redux-starter-kit";

import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";

import { createLogicMiddleware } from "redux-logic";
import logics from "./logics";

import authSlice, { authActions } from "./features/auth/slice";
import alertSlice, { alertActions } from "./features/alert/slice";
import debugSlice, { debugActions } from "./features/debug/slice";
import lobbySlice, { lobbyActions } from "./features/lobby/slice";
import gameSlice, { gameActions } from "./features/game/slice";

import ErrorBoundary from "./ui/ErrorBoundary";

import TopBar from "./ui/TopBar";
import Login from "./ui/Login";
import Game from "./ui/Game";
import Lobby from "./ui/Lobby";
import Info from "./ui/Info";

const client = feathers();
client.configure(socketio(io()));
client.configure(auth());

const rootReducer = combineReducers({
  alert: alertSlice.reducer,
  auth: authSlice.reducer,
  debug: debugSlice.reducer,
  lobby: lobbySlice.reducer,
  game: gameSlice.reducer
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
client.service("games").on("removed", (data, context) => {
  store.dispatch(lobbyActions.onGameRemoved(data));
});

client.service("steps").on("created", (data, context) => {
  store.dispatch(gameActions.onStepCreated(data));
});

function RootComponent(props) {
  const user = useSelector(s => s.auth.user);
  const alert = useSelector(s => s.alert.currentAlert);
  useEffect(() => {
    store.dispatch(authActions.reauthenticate());
  }, []);
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ErrorBoundary>
          <TopBar />
        </ErrorBoundary>
        {alert ? (
          <div>
            <strong>
              {alert.timestamp}: {alert.message}
            </strong>
          </div>
        ) : null}
        {user ? (
          <Switch>
            <Route path="/game/:id">
              <ErrorBoundary>
                <Game user={user} />
              </ErrorBoundary>
            </Route>
            <Route path="/about">
              <Info />
            </Route>
            <Route>
              <ErrorBoundary>
                <Lobby />
              </ErrorBoundary>
            </Route>
          </Switch>
        ) : (
          <Switch>
            <Route path="/about">
              <Info />
            </Route>
            <Route>
              <Login />
            </Route>
          </Switch>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <RootComponent />
  </Provider>,
  document.getElementById("react-root")
);

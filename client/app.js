import React from "react";
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

const client = feathers();
client.configure(socketio(io()));
client.configure(auth());

client
  .reAuthenticate()
  .then(() => console.log("reauthentication ok"))
  .catch(() => console.log("reauthentication not ok"));

function login() {
  client.authenticate({
    strategy: "local",
    email: "alf@example.com",
    password: "alf1"
  });
}

function logout() {
  client.logout();
}

const authSlice = createSlice({
  slice: "auth",
  initialState: { user: null },
  reducers: {
    onLogin(state, action) {
      return action.payload;
    },
    onLogout(state, action) {
      return { user: null };
    }
  }
});

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
  auth: authSlice.reducer,
  frob: frobSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({ thunk: false })
});

client.on("login", data => {
  console.log("on login");
  store.dispatch(authSlice.actions.onLogin(data));
});
client.on("logout", () => {
  console.log("on logout");
  store.dispatch(authSlice.actions.onLogout());
});

function TestComponent(props) {
  const everything = useSelector(s => s);
  const user = useSelector(s => s.auth.user);
  return (
    <>
      <div>Hello, {JSON.stringify(everything)}!</div>
      <button onClick={() => store.dispatch(frobSlice.actions.frob())}>
        Frob
      </button>
      <button onClick={() => store.dispatch(frobSlice.actions.unfrob())}>
        Unfrob
      </button>
      <button onClick={login}>Log in</button>
      <button onClick={logout}>Log out</button>
      <div>User object is: {JSON.stringify(user)}</div>
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <TestComponent />
  </Provider>,
  document.getElementById("react-root")
);

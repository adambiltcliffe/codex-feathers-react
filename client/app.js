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
import { createLogic, createLogicMiddleware } from "redux-logic";

import authSlice from "./features/auth/slice";
import authLogics from "./features/auth/logic";

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
  auth: authSlice.reducer,
  frob: frobSlice.reducer
});

const feathersErrorLogic = createLogic({
  type: "*",
  transform({ getState, action }, next) {
    if (action.payload && action.payload.type == "FeathersError") {
      action.error = true;
      action.payload = action.payload.toJSON();
    }
    next(action);
  }
});

const logicMiddleware = createLogicMiddleware(
  [...authLogics, feathersErrorLogic],
  { client }
);

const store = configureStore({
  reducer: rootReducer,
  middleware: [logicMiddleware, ...getDefaultMiddleware({ thunk: false })]
});

function TestComponent(props) {
  const everything = useSelector(s => s);
  const user = useSelector(s => s.auth.user);
  useEffect(() => {
    store.dispatch(authSlice.actions.reauthenticate());
  }, []);
  return (
    <>
      <div>Hello, {JSON.stringify(everything)}!</div>
      <button onClick={() => store.dispatch(frobSlice.actions.frob())}>
        Frob
      </button>
      <button onClick={() => store.dispatch(frobSlice.actions.unfrob())}>
        Unfrob
      </button>
      <button onClick={() => store.dispatch(authSlice.actions.authenticate())}>
        Log in
      </button>
      <button onClick={() => store.dispatch(authSlice.actions.logout())}>
        Log out
      </button>
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

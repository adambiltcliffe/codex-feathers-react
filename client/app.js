import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";

const client = feathers();
client.configure(socketio(io()));
client.configure(auth());

console.log("ok");

function login() {
  console.log("trying to log in");
  client.authenticate({
    username: "alf",
    email: "alf@example.com",
    password: "alf1",
    strategy: "local"
  });
}

function logout() {
  console.log("trying to log out");
  client.logout();
}

function TestComponent(props) {
  let alive = true;
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tryingLogin, setTryingLogin] = useState(true);
  useEffect(() => {
    client
      .reAuthenticate()
      .then(() => client.get("authentication"))
      .then(auth => {
        if (alive) {
          setUser(auth.user);
          setTryingLogin(false);
        }
      })
      .catch(err => {
        if (alive) {
          setError(err);
          setTryingLogin(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <>
      <div>Here is the state:</div>
      <div>error: {JSON.stringify(error)}</div>
      <div>user: {JSON.stringify(user)}</div>
      <div>tryingLogin: {JSON.stringify(tryingLogin)}</div>
      <button onClick={login}>Log in</button>
      <button onClick={logout}>Log out</button>
    </>
  );
}

ReactDOM.render(<TestComponent />, document.getElementById("react-root"));

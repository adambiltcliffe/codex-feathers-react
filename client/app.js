import React from "react";
import ReactDOM from "react-dom";

import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";

function TestComponent(props) {
  return <div>Hello, World!</div>;
}

const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(auth());
console.log("Feathers is ok!");

client
  .authenticate({
    username: "alf",
    email: "alf@example.com",
    password: "alf1",
    strategy: "local"
  })
  .then(() => client.service("games").find())
  .then(console.log);

ReactDOM.render(<TestComponent />, document.getElementById("react-root"));

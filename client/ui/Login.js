import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { authActions } from "../features/auth/slice";

import { Box, Button, Content, Heading } from "react-bulma-components";

const LoginForm = props => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const updateUsername = useCallback(evt => {
    setUsername(evt.target.value);
  });
  const [password, setPassword] = useState("");
  const updatePassword = useCallback(evt => {
    setPassword(evt.target.value);
  });
  return (
    <div className="field">
      <label className="label">Username</label>
      <div className="control">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={updateUsername}
        />
      </div>
      <label className="label">Password</label>
      <div className="control">
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={updatePassword}
        />
      </div>
      <Button
        onClick={useCallback(() => {
          dispatch(authActions.authenticate({ username, password }));
          setUsername("");
          setPassword("");
        }, [username, setUsername, password, setPassword])}
      >
        Log in
      </Button>
    </div>
  );
};

const SignupForm = props => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const updateUsername = useCallback(evt => {
    setUsername(evt.target.value);
  });
  const [email, setEmail] = useState("");
  const updateEmail = useCallback(evt => {
    setEmail(evt.target.value);
  });
  const [password, setPassword] = useState("");
  const updatePassword = useCallback(evt => {
    setPassword(evt.target.value);
  });
  return (
    <div className="field">
      <label className="label">Username</label>
      <div className="control">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={updateUsername}
        />
      </div>
      <label className="label">Email</label>
      <div className="control">
        <input
          className="input"
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={updateEmail}
        />
      </div>
      <label className="label">Password</label>
      <div className="control">
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={updatePassword}
        />
      </div>
      <Button
        onClick={useCallback(() => {
          dispatch(authActions.signup({ username, password, email }));
          setUsername("");
          setPassword("");
          setEmail("");
        }, [username, setUsername, password, setPassword, email, setEmail])}
      >
        Create account
      </Button>
    </div>
  );
};

const Login = props => {
  return (
    <Box>
      <Heading>Log In</Heading>
      <LoginForm />
      <Heading>Sign Up</Heading>
      <SignupForm />
    </Box>
  );
};

export default Login;

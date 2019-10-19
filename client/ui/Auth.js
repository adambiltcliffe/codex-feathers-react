import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../features/auth/selectors";
import { authActions } from "../features/auth/slice";

function Auth(props) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  return (
    <div>
      <div>
        <button onClick={() => dispatch(authActions.authenticate("alf"))}>
          Log in (alf)
        </button>
        <button onClick={() => dispatch(authActions.authenticate("bob"))}>
          Log in (bob)
        </button>
        <button onClick={() => dispatch(authActions.logout())}>Log out</button>
        <span>{user ? `Logged in as ${user.username}` : "Not logged in"}</span>
      </div>
    </div>
  );
}

export default Auth;

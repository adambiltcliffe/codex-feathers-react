import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button, Navbar, Content, Icon, Tag } from "react-bulma-components";

import { authActions } from "../features/auth/slice";
import { debugActions } from "../features/debug/slice";

import Auth from "./Auth";
import { getUser } from "../features/auth/selectors";

function setDebug(value, dispatch) {
  dispatch(debugActions.setDebug(value));
}

// Needs a link to lobby if logged in; link to login if not

function TopBar(props) {
  const dispatch = useDispatch();
  const debug = useSelector(s => s.debug);
  const user = useSelector(getUser);
  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item>CODEX</Navbar.Item>
        <Navbar.Item onClick={() => dispatch(authActions.logout())}>
          {user ? "Log out " + user.username : "Not logged in"}
        </Navbar.Item>
        <Navbar.Container>
          <Navbar.Link renderAs={Link} to="/lobby" arrowless>
            Play
          </Navbar.Link>
          <Navbar.Link renderAs={Link} to="/about" arrowless>
            About
          </Navbar.Link>
        </Navbar.Container>
        <Navbar.Container>
          <Navbar.Item>
            <label className="checkbox">
              <input
                type="checkbox"
                defaultChecked={debug}
                onChange={useCallback(
                  e => setDebug(e.target.checked, dispatch),
                  []
                )}
              />{" "}
              Debug mode
            </label>
          </Navbar.Item>
        </Navbar.Container>
      </Navbar.Brand>
    </Navbar>
  );
}

export default TopBar;

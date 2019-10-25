import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navbar } from "react-bulma-components";

import { debugActions } from "../features/debug/slice";

import Auth from "./Auth";

function setDebug(value, dispatch) {
  dispatch(debugActions.setDebug(value));
}

function TopBar(props) {
  const dispatch = useDispatch();
  const debug = useSelector(s => s.debug);
  return (
    <Navbar>
      <Navbar.Brand>
        <Auth />
      </Navbar.Brand>
      <Navbar.Menu>
        <label class="checkbox">
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
      </Navbar.Menu>
    </Navbar>
  );
}

export default TopBar;

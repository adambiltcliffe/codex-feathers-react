import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { gameActions } from "../features/game/slice";

import DebugActionInput from "./DebugActionInput";

function ActionButton({ action }) {
  const dispatch = useDispatch();
  return (
    <button
      size="small"
      variant="outlined"
      onClick={useCallback(() => dispatch(gameActions.act(action)))}
    >
      {(JSON.stringify(action) || "").split(",").join(", ")}
    </button>
  );
}

function ActionInputs(props) {
  const { state } = props;
  const debug = useSelector(s => s.debug);
  if (debug) {
    return <DebugActionInput state={state} />;
  } else
    return CodexGame.suggestActions(state).map(act => (
      <ActionButton key={JSON.stringify(act)} action={act} />
    ));
}

export default ActionInputs;

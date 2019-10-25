import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "react-bulma-components";

import { gameActions } from "../../features/game/slice";

// Currently this is a fallback implementation to actually let you
// play the game

function JSONActionButton({ action }) {
  const dispatch = useDispatch();
  return (
    <button onClick={useCallback(() => dispatch(gameActions.act(action)))}>
      {(JSON.stringify(action) || "").split(",").join(", ")}
    </button>
  );
}

function ChoicePrompt(props) {
  const { state } = props;
  return (
    <Box>
      {CodexGame.suggestActions(state).map(act => (
        <JSONActionButton key={JSON.stringify(act)} action={act} />
      ))}
    </Box>
  );
}

export default ChoicePrompt;

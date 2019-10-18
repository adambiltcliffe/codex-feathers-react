import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";

import { gameActions } from "../features/game/slice";
import {
  playerCanAct,
  getShownIndex,
  getShownState
} from "../features/game/selectors";

function ActionButton({ action }) {
  const dispatch = useDispatch();
  return (
    <Button onClick={useCallback(() => dispatch(gameActions.act(action)))}>
      {JSON.stringify(action)}
    </Button>
  );
}

function Game(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(gameActions.openGame(id));
    return () => {
      dispatch(gameActions.closeGame());
    };
  }, [props.user]);
  const index = useSelector(getShownIndex);
  const currentState = useSelector(getShownState);
  const canSuggestAction = useSelector(playerCanAct)(props.user._id);
  return (
    <>
      <span>
        Hi {id}, step {index}
      </span>
      <code>{JSON.stringify(currentState)}</code>
      <hr />
      <code>
        {(canSuggestAction ? CodexGame.suggestActions(currentState) : []).map(
          act => (
            <ActionButton key={JSON.stringify(act)} action={act} />
          )
        )}
      </code>
    </>
  );
}

export default Game;

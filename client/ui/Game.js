import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";

import { gameActions } from "../features/game/slice";

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
  const { current, states } = useSelector(s => s.game);
  const canSuggestAction =
    current &&
    states &&
    states.length > 0 &&
    props.user._id == current.activePlayer;
  return (
    <>
      <span>Hi {id}</span>
      <code>{JSON.stringify(states)}</code>
      <hr />
      <code>
        {(canSuggestAction
          ? CodexGame.suggestActions(states[states.length - 1])
          : []
        ).map(act => (
          <ActionButton key={JSON.stringify(act)} action={act} />
        ))}
      </code>
    </>
  );
}

export default Game;

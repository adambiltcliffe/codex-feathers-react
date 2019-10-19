import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { gameActions } from "../features/game/slice";
import {
  playerCanAct,
  getShownIndex,
  getShownState
} from "../features/game/selectors";

function ActionButton({ action }) {
  const dispatch = useDispatch();
  return (
    <button
      size="small"
      variant="outlined"
      onClick={useCallback(() => dispatch(gameActions.act(action)))}
    >
      {JSON.stringify(action)}
    </button>
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
      <div container spacing={3}>
        <div item xs={12} sm={3}>
          <div>
            <code>
              {(canSuggestAction
                ? CodexGame.suggestActions(currentState)
                : []
              ).map(act => (
                <ActionButton key={JSON.stringify(act)} action={act} />
              ))}
            </code>
          </div>
        </div>
        <div item xs={12} sm={6}>
          <div>
            <code>{JSON.stringify(currentState)}</code>
          </div>
        </div>
        <div item xs={12} sm={3}>
          <div>
            right right right right right right right right right right right
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;

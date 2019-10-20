import CodexGame from "@adam.biltcliffe/codex";
import fillTemplate from "es6-dynamic-template";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { gameActions } from "../features/game/slice";
import {
  playerCanAct,
  getShownIndex,
  getShownState,
  isShowingLatestState,
  getGame
} from "../features/game/selectors";

import fromPairs from "lodash/fromPairs";

import { Columns, Message } from "react-bulma-components";
import { makeGameTitle } from "../util";

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

function LogEntry(props) {
  const { state, index, map } = props;
  const dispatch = useDispatch();
  const shownIndex = useSelector(getShownIndex);
  const lines = state.log.map((msg, index) => (
    <div key={index}>{fillTemplate(msg, map)}</div>
  ));
  const color = index == shownIndex ? "primary" : "dark";
  return (
    <Message
      color={color}
      onClick={useCallback(() => dispatch(gameActions.setShownState(index)), [
        index
      ])}
    >
      <Message.Body>{lines}</Message.Body>
    </Message>
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
  const game = useSelector(getGame);
  const currentState = useSelector(getShownState);
  const currentPlayerCanAct = useSelector(playerCanAct)(props.user._id);
  const showingLatest = useSelector(isShowingLatestState);
  const history = useSelector(s => s.game.states || []);
  const canSuggestAction = currentPlayerCanAct && showingLatest;
  const usernameMap =
    game && game.players
      ? fromPairs(Object.values(game.players).map(p => [p.user, p.username]))
      : {};
  return (
    <Columns className="is-fullheight main">
      <Columns.Column size="one-quarter" className="left-scrollable-panel">
        <div>
          {game ? (
            <>
              <div>{makeGameTitle(game)}</div>
              <div>{game.comment}</div>
            </>
          ) : (
            <div>Loading ...</div>
          )}
          {canSuggestAction
            ? CodexGame.suggestActions(currentState).map(act => (
                <ActionButton key={JSON.stringify(act)} action={act} />
              ))
            : null}
        </div>
      </Columns.Column>
      <Columns.Column className="centre-scrollable-panel">
        <div>
          <code>
            {(JSON.stringify(currentState) || "").split(",").join(", ")}
          </code>
        </div>
      </Columns.Column>
      <Columns.Column size="one-quarter" className="right-scrollable-panel">
        {history.map((s, index) => (
          <LogEntry key={index} index={index} state={s} map={usernameMap} />
        ))}
      </Columns.Column>
    </Columns>
  );
}

export default Game;

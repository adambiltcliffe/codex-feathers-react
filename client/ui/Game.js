import CodexGame from "@adam.biltcliffe/codex";
import fillTemplate from "es6-dynamic-template";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { gameActions } from "../features/game/slice";
import {
  playerCanAct,
  getShownIndex,
  getShownState,
  isShowingLatestState,
  getGame,
  getMaxIndex
} from "../features/game/selectors";

import fromPairs from "lodash/fromPairs";

import ErrorBoundary from "./ErrorBoundary";
import {
  Box,
  Columns,
  Content,
  Heading,
  Message
} from "react-bulma-components";
import GameBoard from "./GameBoard";
import PlaybackButtons from "./PlaybackButtons";
import Queue from "./Queue";

import { makeGameTitle, makeTurnAndPhaseDescription } from "../util";

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

const LogEntry = React.forwardRef((props, ref) => {
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
      <Message.Body>
        <Content size="small">
          <span ref={ref}>{lines}</span>
        </Content>
      </Message.Body>
    </Message>
  );
});

function Game(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(gameActions.openGame(id));
    return () => {
      dispatch(gameActions.closeGame());
    };
  }, [props.user]);
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
  const bottomElement = useRef();
  const [scrolledUp, setScrolledUp] = useState(false);
  const onScroll = useCallback(e => {
    setScrolledUp(
      e.target.scrollHeight - e.target.scrollTop !== e.target.clientHeight
    );
  });
  useEffect(() => {
    if (!scrolledUp && bottomElement.current) {
      bottomElement.current.scrollIntoView();
    }
  });
  return (
    <Columns className="is-fullheight main">
      <Columns.Column size="one-fifth" className="left-scrollable-panel">
        <ErrorBoundary>
          <div>
            {game ? (
              <>
                <Heading>{makeGameTitle(game)}</Heading>
                <Heading subtitle>{game.comment}</Heading>
                <Content>
                  {makeTurnAndPhaseDescription(currentState, usernameMap)}
                </Content>
              </>
            ) : (
              <div>Loading ...</div>
            )}
            <PlaybackButtons />
            <Queue state={currentState} />
            {canSuggestAction
              ? CodexGame.suggestActions(currentState).map(act => (
                  <ActionButton key={JSON.stringify(act)} action={act} />
                ))
              : null}
          </div>
        </ErrorBoundary>
      </Columns.Column>
      <Columns.Column className="centre-scrollable-panel">
        <ErrorBoundary>
          {currentState ? (
            <GameBoard state={currentState} usernames={usernameMap} />
          ) : null}
        </ErrorBoundary>
      </Columns.Column>
      <Columns.Column
        size="one-fifth"
        className="right-scrollable-panel"
        onScroll={onScroll}
      >
        <ErrorBoundary>
          {history.map((s, index) => (
            <LogEntry
              key={index}
              index={index}
              state={s}
              map={usernameMap}
              ref={index == history.length - 1 ? bottomElement : null}
            />
          ))}
        </ErrorBoundary>
      </Columns.Column>
    </Columns>
  );
}

export default Game;

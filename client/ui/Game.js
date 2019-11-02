import CodexGame from "@adam.biltcliffe/codex";
import fillTemplate from "es6-dynamic-template";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { gameActions } from "../features/game/slice";
import {
  playerCanAct,
  getShownIndex,
  getShownState,
  isShowingLatestState,
  isGameLoaded,
  getUsernameMap,
  getPlayerList,
  getComment
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
import ActionInputs from "./ActionInputs";
import GameBoard from "./GameBoard";
import PlaybackButtons from "./PlaybackButtons";
import Queue from "./Queue";

import { makeTurnAndPhaseDescription } from "../util";
import { useWhyDidYouUpdate } from "../why-did-you-update";

function makeGameTitleForCurrentGame(playerList, usernameMap) {
  return `${usernameMap[playerList[0]]} vs. ${usernameMap[playerList[1]]}`;
}

const LogEntry = React.memo(
  React.forwardRef((props, ref) => {
    const { log, index, map, color } = props;
    const dispatch = useDispatch();
    const lines = useMemo(() =>
      log.map((msg, index) => <div key={index}>{fillTemplate(msg, map)}</div>)
    );
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
  })
);

const LogColumn = React.memo(
  ({ history, usernameMap, shownIndex, onScroll, bottomRef }) => (
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
            log={s.log}
            map={usernameMap}
            color={index == shownIndex ? "primary" : "dark"}
            ref={index == history.length - 1 ? bottomRef : null}
          />
        ))}
      </ErrorBoundary>
    </Columns.Column>
  )
);

const Game = React.memo(props => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(gameActions.openGame(id));
    return () => {
      dispatch(gameActions.closeGame());
    };
  }, [props.user]);
  const currentState = useSelector(getShownState);
  const currentPlayerCanAct = useSelector(playerCanAct)(props.user._id);
  const showingLatest = useSelector(isShowingLatestState);
  const canSuggestAction = currentPlayerCanAct && showingLatest;
  const bottomElement = useRef();
  const [scrolledUp, setScrolledUp] = useState(false);
  const onScroll = useCallback(
    e => {
      setScrolledUp(
        e.target.scrollHeight - e.target.scrollTop !== e.target.clientHeight
      );
    },
    [setScrolledUp]
  );
  useEffect(() => {
    if (!scrolledUp && bottomElement.current) {
      bottomElement.current.scrollIntoView();
    }
  }, [currentState]);
  return (
    <GameView
      canAct={canSuggestAction}
      onScroll={onScroll}
      bottomElement={bottomElement}
    />
  );
});

const GameView = React.memo(props => {
  const { canAct, onScroll, bottomElement } = props;
  const loaded = useSelector(isGameLoaded);
  const comment = useSelector(getComment);
  const currentState = useSelector(getShownState);
  const shownIndex = useSelector(getShownIndex);
  const history = useSelector(s => s.game.states || []);
  const playerList = useSelector(getPlayerList);
  const usernameMap = useSelector(getUsernameMap);
  return (
    <Columns className="is-fullheight main">
      <Columns.Column size="one-fifth" className="left-scrollable-panel">
        <ErrorBoundary>
          <div>
            {loaded ? (
              <>
                <Heading>
                  {makeGameTitleForCurrentGame(playerList, usernameMap)}
                </Heading>
                <Heading subtitle>{comment}</Heading>
                <Content>
                  {makeTurnAndPhaseDescription(currentState, usernameMap)}
                </Content>
              </>
            ) : (
              <div>Loading ...</div>
            )}
            <PlaybackButtons />
            {canAct ? <ActionInputs state={currentState} /> : null}
            <Content />
            <Queue state={currentState} />
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
      <LogColumn
        history={history}
        usernameMap={usernameMap}
        shownIndex={shownIndex}
        onScroll={onScroll}
        bottomRef={bottomElement}
      />
    </Columns>
  );
});

export default Game;

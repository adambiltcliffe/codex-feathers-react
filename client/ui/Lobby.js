import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";

import { lobbyActions } from "../features/lobby/slice";
import { getAllGames, getErrors } from "../features/lobby/selectors";

function createGame(dispatch) {
  dispatch(
    lobbyActions.createGame({
      comment: Math.random()
        .toString(36)
        .substr(2, 10)
    })
  );
}

function joinGame(dispatch, gameId) {
  dispatch(lobbyActions.joinGame({ gameId }));
}

function deleteGame(dispatch, gameId) {
  dispatch(lobbyActions.deleteGame({ gameId }));
}

function leaveGame(dispatch, gameId) {
  dispatch(lobbyActions.leaveGame({ gameId }));
}

function setReady(dispatch, gameId, ready) {
  dispatch(lobbyActions.setReady({ gameId, ready }));
}

function GameRow({ game }) {
  const dispatch = useDispatch();
  const title = game.players[0]
    ? game.players[1]
      ? `${game.players[0].username} vs. ${game.players[1].username}`
      : `${game.players[0].username} (awaiting opponent)`
    : "(empty)";
  return (
    <div>
      <div>{title}</div>
      {JSON.stringify(game)}
      <Button
        onClick={useCallback(() => joinGame(dispatch, game._id), [game._id])}
      >
        Join
      </Button>
      <Button
        onClick={useCallback(() => leaveGame(dispatch, game._id), [game._id])}
      >
        Leave
      </Button>
      <Button
        onClick={useCallback(() => setReady(dispatch, game._id, true), [
          game._id
        ])}
      >
        Ready
      </Button>
      <Button
        onClick={useCallback(() => setReady(dispatch, game._id, false), [
          game._id
        ])}
      >
        Not ready
      </Button>
      <Button
        onClick={useCallback(() => deleteGame(dispatch, game._id), [game._id])}
      >
        Delete
      </Button>
    </div>
  );
}

function Lobby(props) {
  const dispatch = useDispatch();
  const games = useSelector(getAllGames);
  useEffect(() => {
    dispatch(lobbyActions.openLobby());
    return () => {
      dispatch(lobbyActions.closeLobby());
    };
  }, []);
  const errors = useSelector(getErrors);
  const gameRows = games ? (
    Object.values(games).map(g => <GameRow key={g._id} game={g} />)
  ) : (
    <div>Games not yet loaded ...</div>
  );
  return (
    <>
      {errors ? JSON.stringify(errors) : null}
      <div>This is the lobby.</div>
      {gameRows}
      <Button onClick={useCallback(() => createGame(dispatch))}>
        Create Game
      </Button>
    </>
  );
}

export default Lobby;

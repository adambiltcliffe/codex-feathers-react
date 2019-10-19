import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "react-timeago";

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useParams
} from "react-router-dom";

import { lobbyActions } from "../features/lobby/slice";
import {
  getAllGames,
  getErrors,
  getSelectedGame
} from "../features/lobby/selectors";

function makeGameTitle(game) {
  return game.players[0]
    ? game.players[1]
      ? `${game.players[0].username} vs. ${game.players[1].username}`
      : `${game.players[0].username} (awaiting opponent)`
    : "(empty)";
}

function setSelected(dispatch, gameId) {
  dispatch(lobbyActions.setSelected(gameId));
}

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

function GameDetail({ game }) {
  if (game === undefined) return null;
  const dispatch = useDispatch();
  const gameLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} {...props} />
  ));
  const statusComment = game.started
    ? "Game has started."
    : "Game will start when both players are ready.";
  const playerChips = Object.values(game.players).map(p => {
    const label = game.started
      ? `${p.username}${p.user == game.activePlayer ? " (active player)" : ""}`
      : `${p.username} (${p.ready ? "" : "not "}ready)`;
    return <span key={p._id}>{label}</span>;
  });
  return (
    <div>
      <div>
        <span color="textSecondary">
          Updated <TimeAgo date={game.updatedAt} />
        </span>
        <h5>{makeGameTitle(game)}</h5>
        <span color="textSecondary">{game.comment}</span>
        <span>{statusComment}</span>
        {playerChips}
      </div>

      <div>
        <button
          onClick={useCallback(() => joinGame(dispatch, game._id), [game._id])}
        >
          Join
        </button>
        <button
          onClick={useCallback(() => leaveGame(dispatch, game._id), [game._id])}
        >
          Leave
        </button>
        <button
          onClick={useCallback(() => setReady(dispatch, game._id, true), [
            game._id
          ])}
        >
          Ready
        </button>
        <button
          onClick={useCallback(() => setReady(dispatch, game._id, false), [
            game._id
          ])}
        >
          Not ready
        </button>
        <button
          onClick={useCallback(() => deleteGame(dispatch, game._id), [
            game._id
          ])}
        >
          Delete
        </button>
        <button
          color="primary"
          component={gameLink}
          to={`/game/${game._id}`}
          target="_blank"
        >
          Open game
        </button>
        <Link to={`/game/${game._id}`} target="_blank">
          debug open game
        </Link>
      </div>
    </div>
  );
}

function GameRow({ game }) {
  const dispatch = useDispatch();
  const title = makeGameTitle(game);
  return (
    <tr
      onClick={useCallback(() => setSelected(dispatch, game._id), [game._id])}
    >
      <td>{title}</td>
      <td>{game.comment}</td>
      <td>
        <TimeAgo date={game.updatedAt} />
      </td>
      <td>{game.started ? "Started" : "Not started"}</td>
    </tr>
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
  const selectedGame = useSelector(getSelectedGame);
  const gameRows = games
    ? Object.values(games).map(g => <GameRow key={g._id} game={g} />)
    : null;
  const createGameButton = (
    <button onClick={useCallback(() => createGame(dispatch))}>
      Create Game
    </button>
  );
  return (
    <div>
      <GameDetail game={selectedGame} />
      {errors ? JSON.stringify(errors) : null}
      <table>
        <thead>
          <tr>
            <th>Players</th>
            <th>Comment</th>
            <th>Game updated</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{gameRows}</tbody>
      </table>
      {games ? createGameButton : <div>Loading lobby ...</div>}
    </div>
  );
}

export default Lobby;

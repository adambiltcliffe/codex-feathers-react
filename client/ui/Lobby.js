import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "react-timeago";

import { Link } from "react-router-dom";

import { makeGameTitle } from "../util";

import { lobbyActions } from "../features/lobby/slice";
import {
  getAllGames,
  getErrors,
  getSelectedGame
} from "../features/lobby/selectors";

import { Card, Heading, Table } from "react-bulma-components";

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
    <Card>
      <Card.Content>
        <span color="textSecondary">
          Updated <TimeAgo date={game.updatedAt} />
        </span>
        <Heading>{makeGameTitle(game)}</Heading>
        <Heading subtitle>{game.comment}</Heading>
        <span>{statusComment}</span>
        {playerChips}
      </Card.Content>

      <Card.Footer>
        <Card.Footer.Item
          renderAs="a"
          onClick={useCallback(() => joinGame(dispatch, game._id), [game._id])}
        >
          Join
        </Card.Footer.Item>
        <Card.Footer.Item
          renderAs="a"
          onClick={useCallback(() => leaveGame(dispatch, game._id), [game._id])}
        >
          Leave
        </Card.Footer.Item>
        <Card.Footer.Item
          renderAs="a"
          onClick={useCallback(() => setReady(dispatch, game._id, true), [
            game._id
          ])}
        >
          Ready
        </Card.Footer.Item>
        <Card.Footer.Item
          renderAs="a"
          onClick={useCallback(() => setReady(dispatch, game._id, false), [
            game._id
          ])}
        >
          Not ready
        </Card.Footer.Item>
        <Card.Footer.Item
          renderAs="a"
          onClick={useCallback(() => deleteGame(dispatch, game._id), [
            game._id
          ])}
        >
          Delete
        </Card.Footer.Item>
        <Card.Footer.Item
          renderAs="a"
          color="primary"
          component={gameLink}
          to={`/game/${game._id}`}
          target="_blank"
        >
          Open game
        </Card.Footer.Item>
        <Link to={`/game/${game._id}`} target="_blank">
          debug open game
        </Link>
      </Card.Footer>
    </Card>
  );
}

function GameRow({ game, selected }) {
  const dispatch = useDispatch();
  const title = makeGameTitle(game);
  const cn = selected ? "is-selected" : "";
  return (
    <tr
      className={cn}
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
    ? Object.values(games).map(g => (
        <GameRow
          key={g._id}
          game={g}
          selected={selectedGame && g._id == selectedGame._id}
        />
      ))
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
      <Table>
        <thead>
          <tr>
            <th>Players</th>
            <th>Comment</th>
            <th>Game updated</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{gameRows}</tbody>
      </Table>
      {games ? createGameButton : <div>Loading lobby ...</div>}
    </div>
  );
}

export default Lobby;

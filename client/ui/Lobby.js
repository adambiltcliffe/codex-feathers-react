import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import TimeAgo from "react-timeago";

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useParams
} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

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
    return (
      <Chip
        key={p._id}
        avatar={<Avatar>{p.username[0]}</Avatar>}
        label={label}
      />
    );
  });
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary">
          Updated <TimeAgo date={game.updatedAt} />
        </Typography>
        <Typography variant="h5">{makeGameTitle(game)}</Typography>
        <Typography color="textSecondary">{game.comment}</Typography>
        <Typography>{statusComment}</Typography>
        {playerChips}
      </CardContent>

      <CardActions>
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
          onClick={useCallback(() => deleteGame(dispatch, game._id), [
            game._id
          ])}
        >
          Delete
        </Button>
        <Button
          color="primary"
          component={gameLink}
          to={`/game/${game._id}`}
          target="_blank"
        >
          Open game
        </Button>
      </CardActions>
    </Card>
  );
}

function GameRow({ game }) {
  const dispatch = useDispatch();
  const title = makeGameTitle(game);
  return (
    <TableRow
      onClick={useCallback(() => setSelected(dispatch, game._id), [game._id])}
    >
      <TableCell>{title}</TableCell>
      <TableCell>{game.comment}</TableCell>
      <TableCell>
        <TimeAgo date={game.updatedAt} />
      </TableCell>
      <TableCell>{game.started ? "Started" : "Not started"}</TableCell>
    </TableRow>
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
    <Button onClick={useCallback(() => createGame(dispatch))}>
      Create Game
    </Button>
  );
  return (
    <Paper>
      <GameDetail game={selectedGame} />
      {errors ? JSON.stringify(errors) : null}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Players</TableCell>
            <TableCell>Comment</TableCell>
            <TableCell>Game updated</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{gameRows}</TableBody>
      </Table>
      {games ? createGameButton : <div>Loading lobby ...</div>}
    </Paper>
  );
}

export default Lobby;

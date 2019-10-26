import CodexGame, { constants } from "@adam.biltcliffe/codex";

import React, { useMemo } from "react";
import { Columns, Heading, Level } from "react-bulma-components";

import { useSelector } from "react-redux";
import { getUser } from "../features/auth/selectors";

import EntityCard from "./EntityCard";
import PlayerPrivateInfo from "./PlayerPrivateInfo";

import chunk from "lodash/chunk";
import groupBy from "lodash/groupBy";
import partition from "lodash/partition";
import sortBy from "lodash/sortBy";
import { useWhyDidYouUpdate } from "../why-did-you-update";

const PlayerGameBoardRow = React.memo(props => {
  const { entities } = props;
  return (
    <Columns>
      {entities.map(e => (
        <Columns.Column size="one-fifth" key={e.id}>
          <EntityCard entity={e} />
        </Columns.Column>
      ))}
    </Columns>
  );
});

const PlayerGameBoardArea = React.memo(props => {
  const { entities } = props;
  const rows = useMemo(() => chunk(entities, 5), [entities]);
  return (
    <>
      {rows.map(row => (
        <PlayerGameBoardRow entities={row} key={row.map(e => e.id).join(",")} />
      ))}
    </>
  );
});

function PatrolZoneArea(props) {
  const { entities } = props;
  const patrollerWhere = groupBy(entities, e => e.current.patrolSlot);
  return (
    <Columns>
      {[0, 1, 2, 3, 4].map(index => (
        <Columns.Column size="one-fifth" key={index}>
          <Level>{CodexGame.interface.describePatrolSlot(index)}</Level>
          {patrollerWhere[index] ? (
            <EntityCard entity={patrollerWhere[index][0]} />
          ) : null}
        </Columns.Column>
      ))}
    </Columns>
  );
}

function isBackline(entity) {
  return (
    entity.constructing ||
    entity.current.type == constants.types.building ||
    entity.current.type == constants.types.upgrade ||
    entity.current.type == constants.types.spell
  );
}

function PlayerGameBoard(props) {
  const { player, playerNumber, entities, invert, username, isYou } = props;
  const [backline, frontline] = useMemo(() => partition(entities, isBackline), [
    entities
  ]);
  const [patrolling, resting] = useMemo(
    () => partition(frontline, e => e.current.patrolSlot !== null),
    [frontline]
  );
  const handCount = player.hand ? player.hand.length : player.handCount;
  const discardCount = player.discard
    ? player.discard.length
    : player.discardCount;
  const deckCount = player.deck ? player.deck.length : player.deckCount;
  const title = (
    <Level>
      <Heading>{username}</Heading>
      Player {playerNumber}, {player.gold} gold, {player.workers} workers,{" "}
      {handCount} cards in hand, {discardCount} in discard, {deckCount} in deck
    </Level>
  );
  const patrolZoneArea =
    patrolling.length > 0 ? <PatrolZoneArea entities={patrolling} /> : null;
  if (invert) {
    return (
      <>
        {title}
        {patrolZoneArea}
        <PlayerGameBoardArea entities={resting} />
        <PlayerGameBoardArea entities={backline} />
        {isYou ? <PlayerPrivateInfo player={player} /> : null}
      </>
    );
  } else {
    return (
      <>
        {title}
        <PlayerGameBoardArea entities={backline} />
        <PlayerGameBoardArea entities={resting} />
        {patrolZoneArea}
      </>
    );
  }
}

const GameBoard = React.memo(props => {
  const { state, usernames } = props;
  const user = useSelector(getUser);
  const entities = useMemo(
    () =>
      Object.values(state.entities).concat(
        state.constructing.map(c => ({
          constructing: c,
          id: c,
          current: { controller: state.playerList[state.activePlayerIndex] }
        }))
      ),
    [state]
  );
  const playerBoards = useMemo(() => groupBy(entities, "current.controller"), [
    entities
  ]);
  const orderedPlayers = useMemo(
    () => sortBy(state.playerList, id => (id == user._id ? 1 : 0)),
    [state, user]
  );
  return (
    <>
      {orderedPlayers.map((id, index) => (
        <PlayerGameBoard
          player={state.players[id]}
          playerNumber={state.playerList.indexOf(id) + 1}
          key={id}
          entities={playerBoards[id]}
          invert={index > 0}
          username={usernames[id]}
          isYou={id == user._id}
        />
      ))}
    </>
  );
});

export default GameBoard;

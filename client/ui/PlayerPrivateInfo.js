import React from "react";

import CodexGame from "@adam.biltcliffe/codex";

import { Content, Heading, Level } from "react-bulma-components";

function getCardName(card) {
  return CodexGame.interface.getCardInfo(card).name;
}

export default function PlayerPrivateInfo(props) {
  const { player } = props;
  return (
    <>
      <Level>
        <Heading subtitle>Your hand and discard</Heading>
      </Level>
      <Content>Hand: {player.hand.map(getCardName).join(", ")}</Content>
      <Content>Discard: {player.discard.map(getCardName).join(", ")}</Content>
    </>
  );
}

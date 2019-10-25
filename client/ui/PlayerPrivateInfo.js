import React from "react";

import { Content, Heading, Level } from "react-bulma-components";

export default function PlayerPrivateInfo(props) {
  console.log(player);
  const { player } = props;
  return (
    <>
      <Level>
        <Heading subtitle>Your hand and discard</Heading>
      </Level>
      <Content>Hand: {player.hand.join(", ")}</Content>
      <Content>Discard: {player.discard.join(", ")}</Content>
    </>
  );
}

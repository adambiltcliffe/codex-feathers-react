import React from "react";

import { Box, Content, Heading } from "react-bulma-components";

const Info = props => {
  return (
    <Box>
      <Heading>What is this?</Heading>
      <Content>
        This is an online implementation of the game Codex by David Sirlin. It's
        currently very much a work-in-progress, but it should be possible to use
        it to play the introductory 1-hero game (Bashing vs. Finesse).
      </Content>
      <Heading subtitle>What is included?</Heading>
      <Content>
        At the moment you can play Bashing vs. Finesse against another player,
        with the two sides assigned randomly. All elements of the rules should
        theoretically be implemented. You should also be able to watch other
        players' games in real time.
      </Content>
      <Heading subtitle>What is coming?</Heading>
      <Content>
        Some of the low-hanging fruit includes being able to choose which side
        you play, being able to watch games without logging in and adding some
        niceties to the interface such as viewing the text of the cards in your
        hand and codex. Hopefully it should also be possible at some point to
        view an archive of past games in text form or in a machine-readable
        format (at the moment, there is no guarantee your games will not vanish
        into the aether the moment something happens to the server). Beyond
        that, adding more specs and implementing the full 3-hero game is the
        eventual goal, assuming that anyone is interested.
      </Content>
      <Heading subtitle>Are there bugs?</Heading>
      <Content>
        Almost certainly. Please report bugs in the web client{" "}
        <a href="https://github.com/adambiltcliffe/codex-feathers-react">
          here
        </a>{" "}
        and bugs in the underlying rules engine{" "}
        <a href="https://github.com/adambiltcliffe/codex">here</a> (if you don't
        know which is it, report against the web client first).
      </Content>
      <Heading subtitle>Change history</Heading>
      <Content>
        May 2020: Bug fixes
        <ul>
          <li>
            <b>Healing</b> no longer heals buildings.
          </li>
          <li>
            Your hero should now level up properly when an opposing hero dies.
          </li>
          <li>
            Harmony should no longer create tokens when your opponent casts a
            spell.
          </li>
          <li>
            Destroying a unit with a <b>Dies:</b> trigger with Final Smash
            should no longer freeze the game.
          </li>
        </ul>
      </Content>
    </Box>
  );
};

export default Info;

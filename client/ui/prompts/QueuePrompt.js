import CodexGame, { constants } from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Content } from "react-bulma-components";

import { gameActions } from "../../features/game/slice";

function QueuePrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  return (
    <>
      <Content>Add triggered actions to the queue:</Content>
      {state.newTriggers.map((trigger, index) => (
        <Button
          key={index}
          onClick={useCallback(() =>
            dispatch(gameActions.act({ type: "queue", index }))
          )}
        >
          {CodexGame.interface.describeQueueItem(trigger)}
        </Button>
      ))}
    </>
  );
}

export default QueuePrompt;

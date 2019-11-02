import CodexGame, { constants } from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Content } from "react-bulma-components";

import { gameActions } from "../../features/game/slice";

// Currently this is a fallback implementation to actually let you
// play the game

function JSONActionButton({ action }) {
  const dispatch = useDispatch();
  return (
    <Button onClick={useCallback(() => dispatch(gameActions.act(action)))}>
      {(JSON.stringify(action) || "").split(",").join(", ")}
    </Button>
  );
}

function SingleTargetChoicePrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  return (
    <>
      {CodexGame.interface
        .getCurrentPromptCountAndTargets(state)
        .targets.map(id => (
          <Button
            key={id}
            onClick={useCallback(() =>
              dispatch(gameActions.act({ type: "choice", target: id }))
            )}
          >
            {state.entities[id].current.displayName}
          </Button>
        ))}
    </>
  );
}

function ModalChoicePrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  return (
    <>
      {CodexGame.interface
        .getCurrentPromptModalOptions(state)
        .map((text, index) => (
          <Button
            key={index}
            onClick={useCallback(() =>
              dispatch(gameActions.act({ type: "choice", index }))
            )}
          >
            {text}
          </Button>
        ))}
    </>
  );
}

function ChoicePrompt(props) {
  const { state } = props;
  let control = null;
  switch (CodexGame.interface.getCurrentPromptMode(state)) {
    case constants.targetMode.single: {
      control = <SingleTargetChoicePrompt state={state} />;
      break;
    }
    case constants.targetMode.modal: {
      control = <ModalChoicePrompt state={state} />;
      break;
    }
    default: {
      control = (
        <Box>
          {CodexGame.suggestActions(state).map(act => (
            <JSONActionButton key={JSON.stringify(act)} action={act} />
          ))}
        </Box>
      );
    }
  }
  console.log(CodexGame.suggestActions);
  return (
    <>
      <Content>{CodexGame.interface.getCurrentPrompt(state)}</Content>
      {control}
    </>
  );
}

export default ChoicePrompt;

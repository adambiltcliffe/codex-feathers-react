import CodexGame, { constants } from "@adam.biltcliffe/codex";

import { produce } from "immer";

import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Content } from "react-bulma-components";

import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

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
            className={pending ? "button is-loading" : "button"}
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

function MultipleTargetChoicePrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const { targets, count } = useMemo(
    () => CodexGame.interface.getCurrentPromptCountAndTargets(state),
    [state]
  );
  const [currentChoices, setCurrentChoices] = useState(
    () => new Array(count).fill(null),
    [state]
  );
  const changeHandlers = useMemo(
    () =>
      new Array(count).fill(null).map((_, index) => e =>
        setCurrentChoices(
          produce(currentChoices, draft => {
            draft[index] = e.target.value == "null" ? null : e.target.value;
          })
        )
      ),
    [state, currentChoices]
  );
  const currentAction = useMemo(
    () => ({ type: "choice", targets: currentChoices.filter(c => c !== null) }),
    [state, currentChoices]
  );
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(gameActions.act(currentAction));
    },
    [currentAction]
  );
  const isLegal = useMemo(
    () => CodexGame.interface.isLegalAction(state, currentAction),
    [state, currentAction]
  );
  return (
    <>
      {currentChoices.map((c, index) => (
        <div className="select" key={index}>
          <select defaultValue={c} onChange={changeHandlers[index]}>
            <option key="null" value="null">
              Nothing
            </option>
            {targets.map(id => (
              <option key={id} value={id}>
                {state.entities[id].current.displayName}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        className={pending ? "button is-loading" : "button"}
        disabled={!isLegal}
        onClick={handleSubmit}
      >
        Okay
      </button>
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
            className={pending ? "button is-loading" : "button"}
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
    case constants.targetMode.multiple: {
      control = <MultipleTargetChoicePrompt state={state} />;
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
  return (
    <>
      <Content>{CodexGame.interface.getCurrentPrompt(state)}</Content>
      {control}
    </>
  );
}

export default ChoicePrompt;

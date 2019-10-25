import CodexGame from "@adam.biltcliffe/codex";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { gameActions } from "../features/game/slice";

function DebugActionInput(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const [newAction, setNewAction] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [validation, setValidation] = useState("No action entered");
  const handleActionChange = useCallback(e => {
    setNewAction(e.target.value);
    validate(e.target.value);
  });
  const validate = useCallback(
    actionText => {
      try {
        const actionObject = JSON.parse(actionText);
        try {
          CodexGame.checkAction(state, actionObject);
          setAllowSubmit(true);
          setValidation("Action is legal.");
        } catch (e) {
          setAllowSubmit(false);
          setValidation("Not a legal action --- " + e);
        }
      } catch (e) {
        setValidation("Could not parse JSON --- " + e);
        setAllowSubmit(false);
      }
    },
    [state]
  );
  const handleSubmit = useCallback(e => {
    e.preventDefault();
    if (!allowSubmit) {
      return;
    }
    const actionObject = JSON.parse(newAction);
    dispatch(gameActions.act(actionObject));
  });
  const actionList = CodexGame.suggestActions(state).map(a => {
    const s = JSON.stringify(a);
    return <option value={s} key={s} />;
  });
  const actionForm = (
    <form onSubmit={handleSubmit}>
      Enter game action in JSON format:
      <input
        type="text"
        list="actions"
        value={newAction}
        onChange={handleActionChange}
      />
      <datalist id="actions">{actionList}</datalist>
      <button type="submit" disabled={!allowSubmit}>
        Submit
      </button>
      <div>{validation}</div>
    </form>
  );
  return actionForm;
}

export default DebugActionInput;

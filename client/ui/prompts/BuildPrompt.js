import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import upperFirst from "lodash/upperFirst";

function getFixtureName(fixture) {
  return upperFirst(CodexGame.interface.describeFixture(fixture));
}

function BuildPrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const acts = useMemo(() => CodexGame.interface.legalBuildActions(state), [
    state
  ]);
  if (acts.length == 0) {
    return null;
  }
  const [currentFixture, setCurrentFixture] = useState(acts[0].fixture);
  const handleChange = useCallback(e => {
    setCurrentFixture(e.target.value);
  }, []);
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(gameActions.act({ type: "build", fixture: currentFixture }));
    },
    [currentFixture]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          Construct a building:
          <div className="select">
            <select defaultValue={currentFixture} onChange={handleChange}>
              {acts.map(a => (
                <option key={a.fixture} value={a.fixture}>
                  {getFixtureName(a.fixture)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Start construction
          </button>
        </Container>
      </Panel.Block>
    </>
  );
}

export default BuildPrompt;

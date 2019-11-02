import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import upperFirst from "lodash/upperFirst";

function describeAbility(entity, index) {
  return CodexGame.interface.describeEntityAbility(entity, index);
}

const ActivatePrompt = React.memo(props => {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const tree = useMemo(
    () => CodexGame.interface.legalActivateActionTree(state),
    [state]
  );
  const sources = useMemo(() => Object.keys(tree), [tree]);
  if (sources.length == 0) {
    return null;
  }
  const [currentSource, setCurrentSource] = useState(sources[0]);
  const [currentIndex, setCurrentIndex] = useState(tree[sources[0]][0]);
  useEffect(() => {
    if (!tree[currentSource].includes(currentIndex)) {
      setCurrentIndex(tree[currentSource][0]);
    }
  }, [tree, currentSource, currentIndex]);
  const handleChangeSource = useCallback(e => {
    setCurrentSource(e.target.value);
  }, []);
  const handleChangeIndex = useCallback(e => {
    setCurrentIndex(Number.parseInt(e.target.value));
  });
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(
        gameActions.act({
          type: "activate",
          source: currentSource,
          index: currentIndex
        })
      );
    },
    [currentSource, currentIndex]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          <div>Play ability of:</div>
          <div className="select">
            <select defaultValue={currentSource} onChange={handleChangeSource}>
              {sources.map(id => (
                <option key={id} value={id}>
                  {upperFirst(state.entities[id].current.displayName)}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select defaultValue={currentIndex} onChange={handleChangeIndex}>
              {tree[currentSource].map(index => (
                <option key={index} value={index}>
                  {describeAbility(state.entities[currentSource], index)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Play ability
          </button>
        </Container>
      </Panel.Block>
    </>
  );
});

export default ActivatePrompt;

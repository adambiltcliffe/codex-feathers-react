import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import range from "lodash/range";
import uniqBy from "lodash/uniqBy";

function getCardName(card) {
  return CodexGame.interface.getCardInfo(card).name;
}

function WorkerPrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  if (!CodexGame.interface.canTakeWorkerAction(state)) {
    return null;
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleChange = useCallback(e => {
    setCurrentIndex(Number.parseInt(e.target.value));
  }, []);
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      const act = CodexGame.interface.makeWorkerAction(state, currentIndex);
      dispatch(gameActions.act(act));
    },
    [currentIndex]
  );
  const fullHand =
    state.players[state.playerList[state.activePlayerIndex]].hand;
  const handIndices = uniqBy(range(fullHand.length), index => fullHand[index]);
  return (
    <>
      <Panel.Block>
        <Container>
          Make a worker:
          <div className="select">
            <select defaultValue={currentIndex} onChange={handleChange}>
              {handIndices.map(index => (
                <option key={fullHand[index]} value={index}>
                  {getCardName(fullHand[index])}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Make worker
          </button>
        </Container>
      </Panel.Block>
    </>
  );
}

export default WorkerPrompt;

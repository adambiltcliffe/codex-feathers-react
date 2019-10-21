import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShownIndex, getMaxIndex } from "../features/game/selectors";
import { Button, Icon, Progress } from "react-bulma-components";

import { gameActions } from "../features/game/slice";

export default function PlaybackButtons(props) {
  const dispatch = useDispatch();
  const index = useSelector(getShownIndex);
  const maxIndex = useSelector(getMaxIndex);
  return (
    <>
      <Button
        onClick={useCallback(() => dispatch(gameActions.setShownState(0)))}
      >
        <Icon>
          <>⏪</>
        </Icon>
      </Button>
      <Button
        onClick={useCallback(() =>
          dispatch(gameActions.setShownState(index - 1))
        )}
      >
        <Icon>
          <>◀️</>
        </Icon>
      </Button>
      <Button
        onClick={useCallback(() =>
          dispatch(gameActions.setShownState(index + 1))
        )}
      >
        <Icon>
          <>▶️</>
        </Icon>
      </Button>
      <Button
        onClick={useCallback(() =>
          dispatch(gameActions.setShownState(maxIndex))
        )}
      >
        <Icon>
          <>⏩</>
        </Icon>
      </Button>
      <Progress value={index} max={maxIndex} color="info" />
    </>
  );
}

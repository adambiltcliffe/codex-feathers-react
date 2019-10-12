import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { getUser } from "../features/auth/selectors";
import { authActions } from "../features/auth/slice";

function Auth(props) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  return (
    <Paper position="sticky">
      <Grid container alignItems="center">
        <Button
          variant="contained"
          onClick={() => dispatch(authActions.authenticate("alf"))}
        >
          Log in (alf)
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch(authActions.authenticate("bob"))}
        >
          Log in (bob)
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch(authActions.logout())}
        >
          Log out
        </Button>
        <Divider orientation="vertical" />
        <Typography>
          {user ? `Logged in as ${user.username}` : "Not logged in"}
        </Typography>
      </Grid>
    </Paper>
  );
}

export default Auth;

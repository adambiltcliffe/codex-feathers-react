import { configure } from "@storybook/react";

import "react-bulma-components/dist/react-bulma-components.min.css";
import "../client/css/app.css";

configure(require.context("../client", true, /\.stories\.js$/), module);

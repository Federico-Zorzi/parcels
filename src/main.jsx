import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//* import bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//* import bootstrap Javascript
import * as bootstrap from "bootstrap";

//* import CSS
import "./assets/css/index.css";

//* import application component
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

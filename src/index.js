import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import SpaceProvider from "./store/space-provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SpaceProvider>
    <App />
  </SpaceProvider>
);

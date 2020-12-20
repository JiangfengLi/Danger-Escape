import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import WebAuth from "./components/webauth/WebAuth";
import "bootstrap/dist/css/bootstrap.min.css";

//<App />
ReactDOM.render(
  <React.StrictMode>
    <WebAuth />
  </React.StrictMode>,
  document.getElementById("root")
);

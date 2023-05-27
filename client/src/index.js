import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppContext from "./context/AppContext";
import { AuthContext } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthContext>
      <AppContext>
        <App />
      </AppContext>
    </AuthContext>
  </BrowserRouter>
);

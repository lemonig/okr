import logo from "./logo.svg";
import "./App.less";
import { BrowserRouter } from "react-router-dom";
import Router from './router/index';
import React from "react";
import Loading from './apps/shared/Loading';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <Loading id="app-load" ></Loading>
    </div>
  );
}

export default App;

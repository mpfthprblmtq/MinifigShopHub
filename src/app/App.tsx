import React, {FunctionComponent} from 'react';
import './App.css';
import AppRouter from "./AppRouter";
import {BrowserRouter} from "react-router-dom";

const App: FunctionComponent = () => {
  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
  )
}

export default App;

import React, {FunctionComponent} from 'react';
import './App.css';
import AppRouter from "./AppRouter";
import { HashRouter } from "react-router-dom";

const App: FunctionComponent = () => {
  return (
      <HashRouter>
        <AppRouter />
      </HashRouter>
  )
}

export default App;

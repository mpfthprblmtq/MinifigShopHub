import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./app/App";
import {Provider} from "react-redux";
import store from './redux/store';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const persistor = persistStore(store);

root.render(
  // <React.StrictMode>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
              <App />
          </PersistGate>
      </Provider>
  // </React.StrictMode>
);

import React, { FunctionComponent } from "react";
import './App.css';
import AppRouter from "./AppRouter";
import { HashRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import AuthWrapper from "./AuthWrapper";
import { PermissionsProvider } from "./contexts/PermissionsProvider";
import { determineRedirectURI } from "../utils/AuthUtils";
import { SnackbarProvider } from "./contexts/SnackbarProvider";

const App: FunctionComponent = () => {

  return (
    <Auth0Provider
      domain={ process.env.REACT_APP_AUTH0_DOMAIN! }
      clientId={ process.env.REACT_APP_AUTH0_CLIENT_ID! }
      authorizationParams={{ redirect_uri: determineRedirectURI(window.location.href), audience: 'Minifig-Shop-Hub' }}>
      <AuthWrapper>
        <PermissionsProvider>
          <SnackbarProvider>
            <HashRouter>
              <AppRouter />
            </HashRouter>
          </SnackbarProvider>
        </PermissionsProvider>
      </AuthWrapper>
    </Auth0Provider>
  )
}

export default App;

import { FC, ReactElement, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingSpinner from "../components/_shared/LoadingSpinner";
import { determineRedirectURI } from "../utils/AuthUtils";

interface AuthWrapperProps {
  children: ReactElement;
}

const AuthWrapper: FC<AuthWrapperProps> = ({children}) => {

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitation = params.get("invitation");
    const organization = params.get("organization");

    if (!isAuthenticated && !isLoading && invitation && organization) {
      loginWithRedirect({
        authorizationParams: {
          organization: organization,
          invitation: invitation,
          redirect_uri: determineRedirectURI(window.location.href)
        }
      });
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return isAuthenticated ? children : <LoadingSpinner />;
};

export default AuthWrapper;
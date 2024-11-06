import React, { createContext, useContext, useState, useEffect, ReactElement } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface PermissionsContextType {
  permissions: string[];
}

interface PermissionsProviderProps {
  children: ReactElement;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        const payload = JSON.parse(atob(token.split(".")[1]));
        setPermissions(payload.permissions || []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [getAccessTokenSilently]);

  return (
    <PermissionsContext.Provider
      value={{ permissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

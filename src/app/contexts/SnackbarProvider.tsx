import React, { createContext, useContext, useState, ReactNode, ReactElement } from "react";
import { Snackbar, Alert, SnackbarOrigin, AlertColor } from '@mui/material';

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
  position: SnackbarOrigin;
};

type SnackbarContextType = {
  showSnackbar: (message: string, severity?: AlertColor, position?: SnackbarOrigin) => void;
  hideSnackbar: () => void;
  showSnackbarWithChildren: (message: string, customChildren: ReactElement, severity?: AlertColor, position?: SnackbarOrigin) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
    position: { vertical: 'top', horizontal: 'right' },
  });

  const showSnackbar = (message: string, severity: AlertColor = 'info', position: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }) => {
    setSnackbarState({
      open: true,
      message,
      severity,
      position,
    });
  };

  const [customAlertChildren, setCustomAlertChildren] = useState<ReactElement | undefined>();
  const showSnackbarWithChildren = (message: string, customChildren: ReactElement, severity: AlertColor = 'info', position: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }) => {
    setCustomAlertChildren(customChildren);
    setSnackbarState({
      open: true,
      message,
      severity,
      position,
    });
  };

  const hideSnackbar = () => {
    setSnackbarState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, showSnackbarWithChildren }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={snackbarState.position}
      >
        <Alert onClose={hideSnackbar} severity={snackbarState.severity} sx={{ width: '100%', marginTop: '50px' }}>
          {snackbarState.message}
          {customAlertChildren ?? <></>}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

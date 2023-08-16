export interface SnackbarState {
  open: boolean;
  message?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}
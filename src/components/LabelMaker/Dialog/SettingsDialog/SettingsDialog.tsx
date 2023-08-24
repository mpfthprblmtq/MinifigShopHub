import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { useConfigurationService } from "../../../../hooks/dynamo/useConfigurationService";
import { Configuration } from "../../../../model/dynamo/Configuration";
import { updateStoreConfiguration } from "../../../../redux/slices/configurationSlice";
import {
  Alert,
  Box, Button, CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem, Portal, Snackbar, TextField,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { green } from "@mui/material/colors";

interface SettingsDialogParams {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: FunctionComponent<SettingsDialogParams> = ({open, onClose}) => {
  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
  const dispatch = useDispatch();

  const [autoAdjustmentPercentageCertifiedPreOwned, setAutoAdjustmentPercentageCertifiedPreOwned] =
    useState<number>(configuration.autoAdjustmentPercentageCertifiedPreOwned);
  const [updateConfigLoading, setUpdateConfigLoading] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

  const {updateConfig} = useConfigurationService();

  useEffect(() => {
    setAutoAdjustmentPercentageCertifiedPreOwned(configuration.autoAdjustmentPercentageCertifiedPreOwned);
  }, [configuration]);

  /**
   * CloseDialog method that resets the form on close, otherwise you'll have the same data on close.
   */
  const closeDialog = () => {
    setAutoAdjustmentPercentageCertifiedPreOwned(configuration.autoAdjustmentPercentageCertifiedPreOwned);
    onClose();
  };

  /**
   * Main driver method for updating the configuration.  Takes the three values in state and attempts to update
   * all values.  Uses snackbar for showing success/error.  Stores the new configuration in redux on success.
   */
  const updateConfiguration = async () => {
    setUpdateConfigLoading(true);

    await updateConfig(configuration, {
      ...configuration,
      autoAdjustmentPercentageCertifiedPreOwned: autoAdjustmentPercentageCertifiedPreOwned
    } as Configuration).then(updatedConfig => {
      dispatch(updateStoreConfiguration(updatedConfig));
      setUpdateConfigLoading(false);
      setSnackbarState({open: true, severity: 'success', message: 'Configuration saved successfully!'})
    }).catch(() => {
      setSnackbarState({open: true, severity: 'error', message: 'Couldn\'t save configuration!'});
      setUpdateConfigLoading(false);
    });
  }

  return (
    <>
      <Dialog open={open} onClose={closeDialog} sx={{width: 550, margin: 'auto'}} disableScrollLock={true}>
        <DialogTitle>
          <Typography style={{fontFamily: 'Didact Gothic', fontSize: '20px', marginBottom: '-20px'}}>
            Settings
          </Typography>
        </DialogTitle>
        <Box position="absolute" top={0} right={0} onClick={closeDialog}>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <List>
            <Divider component="li" sx={{width: '100%'}} />
            <ListItem sx={{paddingTop: 0, paddingBottom: 0}}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                  Auto Adjustment Percentage:
                </Box>
                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                  <TextField
                    label='Adjustment'
                    value={autoAdjustmentPercentageCertifiedPreOwned}
                    onChange={(event) =>
                      setAutoAdjustmentPercentageCertifiedPreOwned(+event.target.value)}
                    sx={{width: 140}}
                    InputProps={{endAdornment: '%'}}/>
                </Box>
              </Box>
            </ListItem>
            <ListItem sx={{paddingTop: 0}}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
                <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                  <Button
                    variant='contained'
                    color='success'
                    sx={{width: 120}}
                    disabled={updateConfigLoading}
                    onClick={updateConfiguration}>
                    Save
                  </Button>
                  {updateConfigLoading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </Box>
            </ListItem>
            <Divider component="li" />
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Portal>
        <Snackbar
          sx={{marginTop: '7%'}}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({open: false})}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  )
};

export default SettingsDialog;
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfigurationService } from "../../../../hooks/dynamo/useConfigurationService";
import { Configuration } from "../../../../model/dynamo/Configuration";
import { updateStoreConfiguration } from "../../../../redux/slices/configurationSlice";
import {
  Box, Button, CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem, TextField,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { useSnackbar } from "../../../../app/contexts/SnackbarProvider";
import {useAuth0} from "@auth0/auth0-react";

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

  const { updateConfig } = useConfigurationService();
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth0();

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
   * Main driver method for updating the configuration.
   * Uses snackbar for showing success/error.  Stores the new configuration in redux on success.
   */
  const updateConfiguration = async () => {
    setUpdateConfigLoading(true);

    await updateConfig(user?.org_id, {
      ...configuration,
      autoAdjustmentPercentageCertifiedPreOwned: autoAdjustmentPercentageCertifiedPreOwned
    } as Configuration).then(updatedConfig => {
      if (Object.keys(configuration).length !== 0) {
        dispatch(updateStoreConfiguration(updatedConfig));
        showSnackbar('Configuration saved successfully!', 'success', {horizontal: 'center', vertical: 'top'});
      } else {
        showSnackbar('Couldn\'t save configuration!', 'error', {horizontal: 'center', vertical: 'top'});
      }
      setUpdateConfigLoading(false);
    }).catch(() => {
      showSnackbar('Couldn\'t save configuration!', 'error', {horizontal: 'center', vertical: 'top'});
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
    </>
  )
};

export default SettingsDialog;
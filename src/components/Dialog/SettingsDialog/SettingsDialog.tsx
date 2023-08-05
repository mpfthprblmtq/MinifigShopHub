import React, {FunctionComponent, useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    IconButton,
    List,
    ListItem, Portal, Snackbar, TextField, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";
import {Condition} from "../../../model/_shared/Condition";
import {Close, Refresh} from "@mui/icons-material";
import {useConfigurationService} from "../../../hooks/dynamo/useConfigurationService";
import {useDispatch, useSelector} from "react-redux";
import {updateStoreConfiguration} from "../../../redux/slices/configurationSlice";
import {Configuration} from "../../../model/dynamo/Configuration";
import {green} from "@mui/material/colors";

interface SettingsDialogParams {
    open: boolean;
    onClose: () => void;
    resetCalculations: () => void;
    setBulkCondition: (condition: Condition) => void;
    actionsDisabled: boolean;
}

interface SnackbarState {
    open: boolean;
    message?: string;
    severity?: 'error' | 'warning' | 'info' | 'success';
}

const SettingsDialog: FunctionComponent<SettingsDialogParams> = ({open, onClose, resetCalculations, setBulkCondition, actionsDisabled}) => {

    const { configuration } = useSelector((state: any) => state.configurationStore);
    const dispatch = useDispatch();

    const [usedAutoAdjustmentPercentage, setUsedAutoAdjustmentPercentage] =
        useState<number>(configuration.autoAdjustmentPercentageUsed);
    const [newAutoAdjustmentPercentage, setNewAutoAdjustmentPercentage] =
        useState<number>(configuration.autoAdjustmentPercentageNew);
    const [storeCreditAdjustmentPercentage, setStoreCreditAdjustmentPercentage] =
        useState<number>(configuration.storeCreditValueAdjustment);
    const [condition, setCondition] = useState<Condition>();
    const [updateConfigLoading, setUpdateConfigLoading] = useState<boolean>(false);
    const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

    const {updateConfig} = useConfigurationService();

    useEffect(() => {
        setStoreCreditAdjustmentPercentage(configuration.storeCreditValueAdjustment);
        setNewAutoAdjustmentPercentage(configuration.autoAdjustmentPercentageNew);
        setUsedAutoAdjustmentPercentage(configuration.autoAdjustmentPercentageUsed);
    }, [configuration]);

    /**
     * CloseDialog method that resets the form on close, otherwise you'll have the same data on close.
     */
    const closeDialog = () => {
        setCondition(undefined);
        setStoreCreditAdjustmentPercentage(configuration.storeCreditValueAdjustment);
        setNewAutoAdjustmentPercentage(configuration.autoAdjustmentPercentageNew);
        setUsedAutoAdjustmentPercentage(configuration.autoAdjustmentPercentageUsed);
        onClose();
    };

    /**
     * Main driver method for updating the configuration.  Takes the three values in state and attempts to update
     * all values.  Uses snackbar for showing success/error.  Stores the new configuration in redux on success.
     */
    const updateConfiguration = async () => {
        setUpdateConfigLoading(true);
        await updateConfig(configuration, {
            storeCreditValueAdjustment: storeCreditAdjustmentPercentage,
            autoAdjustmentPercentageNew: newAutoAdjustmentPercentage,
            autoAdjustmentPercentageUsed: usedAutoAdjustmentPercentage
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
                        <ListItem sx={{paddingBottom: 0}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    Auto-Adjustment Percentages:
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <TextField
                                        label='New'
                                        value={newAutoAdjustmentPercentage}
                                        onChange={(event) =>
                                            setNewAutoAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
                                        InputProps={{endAdornment: '%'}}/>
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                                    <TextField
                                        label='Used'
                                        value={usedAutoAdjustmentPercentage}
                                        onChange={(event) =>
                                            setUsedAutoAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
                                        InputProps={{endAdornment: '%'}}/>
                                </Box>
                            </Box>
                        </ListItem>
                        <ListItem sx={{paddingTop: 0, paddingBottom: 0}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    Store Credit Adjustment Percentage:
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <TextField
                                        label='Store Credit'
                                        value={storeCreditAdjustmentPercentage}
                                        onChange={(event) =>
                                            setStoreCreditAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
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
                        <Divider component="li" sx={{width: '100%'}} />
                        <ListItem>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    Reset Calculations
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        disabled={actionsDisabled}
                                        onClick={resetCalculations}
                                        sx={{width: 120}}
                                        startIcon={<Refresh/>}
                                    >Reset
                                    </Button>
                                </Box>
                            </Box>
                        </ListItem>
                        <Divider component="li" sx={{width: '100%'}} />
                        <ListItem alignItems={'center'}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18 }}>
                                    Bulk Set Condition
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', float: 'right' }}>
                                    <ToggleButtonGroup
                                        value={condition}
                                        sx={{width: 120}}
                                        exclusive
                                        disabled={actionsDisabled}
                                        size="small"
                                        onChange={(event, value) => {
                                            setSnackbarState({open: true, severity: 'success', message: 'Bulk condition set!'})
                                            setCondition(value);
                                            setBulkCondition(value);
                                        }}>
                                        <ToggleButton value="NEW"><Typography>New</Typography></ToggleButton>
                                        <ToggleButton value="USED"><Typography>Used</Typography></ToggleButton>
                                    </ToggleButtonGroup>
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
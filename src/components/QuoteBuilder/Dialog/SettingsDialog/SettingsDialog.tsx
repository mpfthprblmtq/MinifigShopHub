import React, {FunctionComponent, useEffect, useState} from "react";
import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    IconButton,
    List,
    ListItem, TextField, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";
import {Condition} from "../../../../model/_shared/Condition";
import {Close, Refresh} from "@mui/icons-material";
import {useConfigurationService} from "../../../../hooks/dynamo/useConfigurationService";
import {useDispatch, useSelector} from "react-redux";
import {updateStoreConfiguration} from "../../../../redux/slices/configurationSlice";
import {Configuration} from "../../../../model/dynamo/Configuration";
import {green} from "@mui/material/colors";
import TooltipConfirmationModal from "../../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import { useSnackbar } from "../../../../app/contexts/SnackbarProvider";

interface SettingsDialogParams {
    open: boolean;
    onClose: () => void;
    resetCalculations: () => void;
    setBulkCondition: (condition: Condition) => void;
    actionsDisabled: boolean;
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
    const [confirmResetCalculationsModalOpen, setConfirmResetCalculationsModalOpen] = useState<boolean>(false);

    const { updateConfig } = useConfigurationService();
    const { showSnackbar } = useSnackbar();

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
            ...configuration,
            storeCreditValueAdjustment: storeCreditAdjustmentPercentage,
            autoAdjustmentPercentageNew: newAutoAdjustmentPercentage,
            autoAdjustmentPercentageUsed: usedAutoAdjustmentPercentage
        } as Configuration).then(updatedConfig => {
            dispatch(updateStoreConfiguration(updatedConfig));
            setUpdateConfigLoading(false);
            showSnackbar('Configuration saved successfully!', 'success', {horizontal: 'center', vertical: 'top'});
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
                        <ListItem sx={{paddingBottom: 0}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <Typography sx={{ fontFamily: 'Didact Gothic' }}>
                                        Auto-Adjustment Percentages:
                                    </Typography>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <Typography sx={{ fontFamily: 'Didact Gothic' }}>
                                        Store Credit Adjustment<br />Percentage:
                                    </Typography>
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18, float: 'right' }}>
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
                                    <Typography sx={{ fontFamily: 'Didact Gothic' }}>
                                        Reset Calculations
                                    </Typography>
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                                    <TooltipConfirmationModal
                                      open={confirmResetCalculationsModalOpen}
                                      content={
                                          <Typography sx={{fontSize: '14px'}}>
                                              Are you sure you want to reset all calculations?
                                          </Typography>}
                                      onConfirm={() => {
                                          onClose();
                                          resetCalculations();
                                      }}
                                      onClose={() => setConfirmResetCalculationsModalOpen(false)}
                                      placement={'top'}
                                      confirmButtonText={'Reset'}
                                    >
                                        <Button
                                            variant='contained'
                                            color='error'
                                            disabled={actionsDisabled}
                                            onClick={() => setConfirmResetCalculationsModalOpen(true)}
                                            sx={{width: 120}}
                                            startIcon={<Refresh/>}
                                        >Reset
                                        </Button>
                                    </TooltipConfirmationModal>
                                </Box>
                            </Box>
                        </ListItem>
                        <Divider component="li" sx={{width: '100%'}} />
                        <ListItem alignItems={'center'}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18 }}>
                                    <Typography sx={{ fontFamily: 'Didact Gothic' }}>
                                        Bulk Set Condition
                                    </Typography>
                                </Box>
                                <Box sx={{ m: 1, position: 'relative', float: 'right' }}>
                                    <ToggleButtonGroup
                                        value={condition}
                                        sx={{width: 120}}
                                        exclusive
                                        disabled={actionsDisabled}
                                        size="small"
                                        onChange={(event, value) => {
                                            showSnackbar('Bulk condition set!', 'success', {horizontal: 'center', vertical: 'top'});
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
        </>
    )
};

export default React.memo(SettingsDialog);
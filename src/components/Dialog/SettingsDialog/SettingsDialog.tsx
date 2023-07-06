import React, {FunctionComponent, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    IconButton,
    List,
    ListItem, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography
} from "@mui/material";
import {Condition} from "../../../model/shared/Condition";
import {Close, Refresh} from "@mui/icons-material";

interface SettingsDialogParams {
    open: boolean;
    onClose: () => void;
    resetCalculations: () => void;
    setBulkCondition: (condition: Condition) => void;
    actionsDisabled: boolean;
}

const SettingsDialog: FunctionComponent<SettingsDialogParams> = ({open, onClose, resetCalculations, setBulkCondition, actionsDisabled}) => {

    const [usedAutoAdjustmentPercentage, setUsedAutoAdjustmentPercentage] = useState<number>(50);
    const [newAutoAdjustmentPercentage, setNewAutoAdjustmentPercentage] = useState<number>(60);
    const [storeCreditAdjustmentPercentage, setStoreCreditAdjustmentPercentage] = useState<number>(110);
    const [condition, setCondition] = useState<Condition>();

    const closeDialog = () => {
        setCondition(undefined);
        onClose();
    }

    return (
        <Dialog open={open} onClose={closeDialog} sx={{width: 550, margin: 'auto'}}>
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
                            <Tooltip title={'Coming Soon!'}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <TextField
                                        label='New'
                                        value={newAutoAdjustmentPercentage}
                                        onChange={(event) =>
                                            setNewAutoAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
                                        InputProps={{endAdornment: '%'}}
                                        disabled/>
                                </Box>
                            </Tooltip>
                            <Tooltip title={'Coming Soon!'}>
                                <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                                    <TextField
                                        label='Used'
                                        value={usedAutoAdjustmentPercentage}
                                        onChange={(event) =>
                                            setUsedAutoAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
                                        InputProps={{endAdornment: '%'}}
                                        disabled/>
                                </Box>
                            </Tooltip>
                        </Box>
                    </ListItem>
                    <ListItem sx={{paddingTop: 0, paddingBottom: 0}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                            <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                Store Credit Adjustment Percentage:
                            </Box>
                            <Tooltip title={'Coming Soon!'}>
                                <Box sx={{ m: 1, position: 'relative', fontSize: 18}}>
                                    <TextField
                                        label='Store Credit'
                                        value={storeCreditAdjustmentPercentage}
                                        onChange={(event) =>
                                            setStoreCreditAdjustmentPercentage(+event.target.value)}
                                        sx={{width: 100}}
                                        InputProps={{endAdornment: '%'}}
                                        disabled/>
                                </Box>
                            </Tooltip>
                        </Box>
                    </ListItem>
                    <ListItem sx={{paddingTop: 0}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
                            <Box sx={{ m: 1, position: 'relative', float: 'right'}}>
                                <Button variant='contained' sx={{width: 120}} disabled>
                                    Save
                                </Button>
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
    )
};

export default SettingsDialog;
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {FunctionComponent} from "react";

interface ConfirmDialogParams {
    open: boolean;
    onCancel: () => void;
    resetCalculations: () => void;
}

const ConfirmResetCalculationsDialog: FunctionComponent<ConfirmDialogParams> = ({open, onCancel, resetCalculations}) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Reset Calculations</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onCancel}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Typography>Are you sure you want to reset all calculations?  This cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                    Cancel
                </Button>
                <Button color={"error"} variant="contained" onClick={resetCalculations}>
                    Reset
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmResetCalculationsDialog;
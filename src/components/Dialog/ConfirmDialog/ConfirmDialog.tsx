import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {Item} from "../../../model/item/Item";
import {FunctionComponent} from "react";

interface ConfirmDialogParams {
    open: boolean;
    item?: Item;
    onCancel: () => void;
    deleteRow: (id: number) => void;
}

const ConfirmDialog: FunctionComponent<ConfirmDialogParams> = ({open, item, onCancel, deleteRow}) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Row Deletion</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onCancel}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Typography>Are you sure you want to delete the following item?</Typography>
                <Typography>{item?.no} - {item?.name}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                    Cancel
                </Button>
                <Button color={"error"} variant="contained" onClick={() => deleteRow(item!.id)}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
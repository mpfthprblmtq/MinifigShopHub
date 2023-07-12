import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {Item} from "../../../model/item/Item";
import React, {FunctionComponent} from "react";

interface ConfirmDialogParams {
    open: boolean;
    item?: Item;
    onCancel: () => void;
    deleteRow: (id: number) => void;
}

const ConfirmItemDeleteDialog: FunctionComponent<ConfirmDialogParams> = ({open, item, onCancel, deleteRow}) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Row Deletion</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onCancel}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <img width="150" alt="bricklink-set-img" src={item?.image_url}/>
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>Are you sure you want to delete the following item?</Typography><br/>
                        <Typography>{item?.no}<br/>{item?.name}</Typography>
                    </Box>
                </Box>
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

export default ConfirmItemDeleteDialog;
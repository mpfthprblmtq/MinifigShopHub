import React, {FunctionComponent, ReactNode} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";

interface InformationDialogParams {
    open: boolean;
    onClose: () => void;
    title: string;
    content: ReactNode;
}

const InformationDialog: FunctionComponent<InformationDialogParams> = ({open, onClose, title, content}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InformationDialog;
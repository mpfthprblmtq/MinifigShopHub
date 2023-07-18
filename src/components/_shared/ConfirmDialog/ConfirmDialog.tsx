import React, {FunctionComponent, ReactNode} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";

interface ConfirmDialogParams {
    open: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
    title: string;
    content: ReactNode;
    confirmText?: string;
    confirmButtonColor?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides>;
}

const ConfirmDialog: FunctionComponent<ConfirmDialogParams> = (
    {open, onClose, onCancel, onConfirm, title, content, confirmText, confirmButtonColor}: ConfirmDialogParams) => {

    return (
        <Dialog open={open} maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onCancel ?? onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={onConfirm} color={confirmButtonColor ?? 'inherit'}>
                    {confirmText ?? 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
import { FunctionComponent } from "react";
import * as React from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Tooltip,
  Typography
} from "@mui/material";

interface TooltipConfirmationModalParams {
  open: boolean;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onClose: () => void;
  onCancel?: () => void;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  children: React.ReactElement<any, any>;
}

const TooltipConfirmationModal: FunctionComponent<TooltipConfirmationModalParams> =
  ({
     open,
     text,
     confirmButtonText,
     cancelButtonText,
     children,
     onConfirm,
     onClose,
     onCancel,
     placement
  }) => {

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Tooltip
        open={open}
        onClose={onClose}
        disableHoverListener
        disableFocusListener
        placement={placement}
        title={<>
          <Typography sx={{fontSize: '14px'}}>{text}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
            <Box sx={{ m: 1, position: 'relative' }} >
              <Button variant='contained' color='primary' onClick={onCancel ?? onClose}>
                {cancelButtonText ? cancelButtonText : 'Cancel'}
              </Button>
            </Box>
            <Box sx={{ m: 1, position: 'relative' }} >
              <Button variant='contained' color='error' onClick={onConfirm}>
                {confirmButtonText ? confirmButtonText : 'Confirm'}
              </Button>
            </Box>
          </Box>
        </>}>
        {children}
      </Tooltip>
    </ClickAwayListener>
  );
};

export default TooltipConfirmationModal;
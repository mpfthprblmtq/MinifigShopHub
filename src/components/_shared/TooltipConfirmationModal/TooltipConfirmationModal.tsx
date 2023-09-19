import { FunctionComponent, ReactElement } from "react";
import * as React from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Tooltip,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button";

interface TooltipConfirmationModalParams {
  open: boolean;
  content: ReactElement;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides>;
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
  children: ReactElement;
  arrow?: boolean;
}

const TooltipConfirmationModal: FunctionComponent<TooltipConfirmationModalParams> =
  ({
     open,
     content,
     confirmButtonText,
     confirmButtonColor,
     cancelButtonText,
     children,
     onConfirm,
     onClose,
     onCancel,
     placement,
     arrow,
  }) => {

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Tooltip
        open={open}
        onClose={onClose}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        placement={placement}
        arrow={!!arrow}
        title={<>
          {content}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button variant='contained' color='primary' onClick={onCancel ?? onClose} onPointerDown={onCancel ?? onClose}>
                {cancelButtonText ? cancelButtonText : 'Cancel'}
              </Button>
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button variant='contained' color={confirmButtonColor ?? 'error'} onClick={onConfirm} onPointerDown={onConfirm}>
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
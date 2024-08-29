import { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import * as React from "react";
import {
  Box,
  Button, Stack, styled, TextField,
  Tooltip
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

interface TooltipConfirmationModalParams {
  open: boolean;
  onChange: (adjustment: number) => void;
  onConfirm: (adjustment: number) => void;
  onClose: () => void;
  onCancel: () => void;
  children: ReactElement;
  adjustment: number;
}

const TextFieldWithoutDials = styled(TextField)(() => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none"
  },
  "& input[type=number]": {
    MozAppearance: "textfield"
  }
}));

const TooltipConfirmationModal: FunctionComponent<TooltipConfirmationModalParams> =
  ({
     open,
     onChange,
     onConfirm,
     onCancel,
     onClose,
     children,
     adjustment
   }) => {

    const [value, setValue] = useState<number>(adjustment);
    useEffect(() => {
      setValue(adjustment);
    }, [adjustment]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleMouseDown = (event: any) => {
        // check if the click target is not part of the tooltip
        if (open && event.target.closest("[role=\"tooltip\"]") === null) {
          setValue(adjustment);
          onCancel();
          onClose();
        }
      };

      if (open) {
        // attach the mousedown event listener when the tooltip opens
        document.addEventListener("mousedown", handleMouseDown);
      } else {
        // remove the event listener when the tooltip closes
        document.removeEventListener("mousedown", handleMouseDown);
      }

      // cleanup function to remove event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
      };
      // eslint-disable-next-line
    }, [open, onClose, onCancel]);

    const increment = () => {
      if (value <= 95) {
        const calculatedValue: number = (Math.floor(value / 5) * 5) + 5;
        setValue(calculatedValue);
        onChange(calculatedValue);
      }
    };

    const decrement = () => {
      if (value >= 5) {
        const calculatedValue: number = (Math.floor(value / 5) * 5) - 5;
        setValue(calculatedValue);
        onChange(calculatedValue);
      }
    };

    return (
      <Tooltip
        open={open}
        placement="top"
        arrow
        title={<>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-around" }}>
            <Box sx={{ m: 1, position: "relative" }}>
              <TextFieldWithoutDials
                sx={{ backgroundColor: "white", maxWidth: "80px" }}
                type="number"
                InputProps={{ endAdornment: "%" }}
                value={value}
                onChange={(event) => {
                  setValue(+event.target.value);
                  onChange(+event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onConfirm(value);
                    onClose();
                  }
                }}
                inputRef={inputRef}
                onFocus={() => {
                  if (inputRef.current) {
                    inputRef.current.select();
                  }
                }}
              />
            </Box>
            <Box sx={{ m: 1, position: "relative", margin: 0 }}>
              <Stack direction={"column"}>
                <Button color="primary" variant="contained" onClick={increment}
                        sx={{
                          minWidth: "40px",
                          maxWidth: "40px",
                          minHeight: "30px",
                          maxHeight: "30px",
                          marginBottom: "2px"
                        }}>
                  <KeyboardArrowUp sx={{ fontSize: "30px" }} />
                </Button>
                <Button color="primary" variant="contained" onClick={decrement}
                        sx={{
                          minWidth: "40px",
                          maxWidth: "40px",
                          minHeight: "30px",
                          maxHeight: "30px",
                          marginTop: "2px"
                        }}>
                  <KeyboardArrowDown sx={{ fontSize: "30px" }} />
                </Button>
              </Stack>
            </Box>
            <Box sx={{ m: 1, position: "relative" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ height: "100%" }}
                onClick={() => {
                  onConfirm(value);
                  onClose();
                }}
                onPointerDown={() => {
                  onConfirm(value);
                  onClose();
                }}>
                Confirm
              </Button>
            </Box>
          </Box>
        </>}>
        {children}
      </Tooltip>
    );
  };

export default TooltipConfirmationModal;
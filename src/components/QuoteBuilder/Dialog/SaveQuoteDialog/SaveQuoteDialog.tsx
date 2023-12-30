import React, { FunctionComponent, useState } from "react";
import {
  Alert,
  Box, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton, Portal, Snackbar,
  TextField,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Quote } from "../../../../model/quote/Quote";
import { useSelector } from "react-redux";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Condition } from "../../../../model/_shared/Condition";
import { useQuoteService } from "../../../../hooks/dynamo/useQuoteService";
import { SavedQuote } from "../../../../model/dynamo/SavedQuote";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";

interface SaveQuoteDialogParams {
  open: boolean;
  onClose: () => void;
}

const SaveQuoteDialog: FunctionComponent<SaveQuoteDialogParams> = ({open, onClose}) => {

  const [customerInfo, setCustomerInfo] = useState<string>('');
  const [keyWords, setKeyWords] = useState<string>('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [inputtedBy, setInputtedBy] = useState<string>('');
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

  const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
  const { saveQuote } = useQuoteService();

  const save = async () => {
    await saveQuote({
      quote: quote,
      customerInfo: customerInfo,
      inputtedBy: inputtedBy,
      keyWords: keyWords?.toLowerCase().replace(', ', ',').split(','),
      date: date?.format('YYYY-MM-DD'),
    } as SavedQuote).then(() => {
      setSnackbarState({open: true, severity: 'success', message: 'Quote saved successfully!'} as SnackbarState);
      closeAndReset();
    }).catch(() => {
      setSnackbarState({open: true, severity: 'error', message: 'Quote not saved successfully!'} as SnackbarState);
    });
  }

  const closeAndReset = () => {
    setCustomerInfo('');
    setKeyWords('');
    setDate(dayjs());
    onClose();
  }

  const validateForm = (): boolean => {
    return !!customerInfo && !!inputtedBy && !!date?.isValid();
  }

  return (
    <>
      <Dialog open={open} onClose={closeAndReset} PaperProps={{ sx: { width: "50%", maxHeight: '80vh' }}}>
        <DialogTitle><Typography sx={{fontFamily: 'Didact Gothic', fontSize: '30px'}}>Save Quote</Typography></DialogTitle>
        <Box position="absolute" top={0} right={0} onClick={closeAndReset}>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '24px', marginBottom: '10px'}}>Customer Details</Typography>
              <TextField
                error={!customerInfo}
                sx={{ width: '250px', marginBottom: '20px' }}
                label={'Customer Info *'}
                value={customerInfo}
                onChange={(event) => setCustomerInfo(event.target.value)}
              /><br />
              <TextField
                error={!inputtedBy}
                sx={{ width: '250px', marginBottom: '20px' }}
                label={'Inputted By *'}
                value={inputtedBy}
                onChange={(event) => setInputtedBy(event.target.value)}
              /><br />
              <TextField
                sx={{ width: '250px', marginBottom: '5px' }}
                label={'Key Words'}
                value={keyWords}
                helperText={'Comma Separated'}
                onChange={(event) => setKeyWords(event.target.value)}
              /><br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(date) => setDate(date)}
                  sx={{ width: '250px' }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      error: !date?.isValid(),
                      // helperText: error?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ m: 1, position: 'relative', marginLeft: '30px' }}>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '24px', marginBottom: '10px'}}>
                Quote Details
              </Typography>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '20px'}}>
                {`${quote.items.length} ${quote.items.length === 1 ? 'Item' : 'Items'}`}
              </Typography>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '16px', marginBottom: '10px'}}>
                {`${quote.items.filter(item => item.condition === Condition.NEW).length} New, `}
                {`${quote.items.filter(item => item.condition === Condition.USED).length} Used `}
              </Typography>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '20px'}}>
                Themes
              </Typography>
              <Typography sx={{fontFamily: 'Didact Gothic', fontSize: '16px'}}>
                {Array.from(new Set(quote.items.map(item => item.theme))).join(', ')}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={!validateForm()} variant="contained" onClick={save}>Save Quote</Button>
        </DialogActions>
      </Dialog>
      <Portal>
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({open: false})}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}

export default React.memo(SaveQuoteDialog);
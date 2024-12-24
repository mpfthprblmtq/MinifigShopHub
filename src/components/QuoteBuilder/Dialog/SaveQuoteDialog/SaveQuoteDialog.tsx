import React, { FunctionComponent, useState } from "react";
import {
  Box, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import { Item } from "../../../../model/item/Item";
import { useSnackbar } from "../../../../app/contexts/SnackbarProvider";

interface SaveQuoteDialogParams {
  open: boolean;
  onClose: () => void;
  addQuote: (quote: SavedQuote) => void;
}

const SaveQuoteDialog: FunctionComponent<SaveQuoteDialogParams> = ({open, onClose, addQuote}) => {

  const [customerInfo, setCustomerInfo] = useState<string>('');
  const [keyWords, setKeyWords] = useState<string>('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [inputtedBy, setInputtedBy] = useState<string>('');

  const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
  const { saveQuote } = useQuoteService();
  const { showSnackbar } = useSnackbar();

  const save = async () => {
    const transformedQuote: Quote = {...quote, items: [...quote.items].map(item => {
        return {...item, salesData: {
          usedSold: {
            item: {no: item.salesData?.usedSold?.item.no},
            total_quantity: item.salesData?.usedSold?.total_quantity,
            min_price: item.salesData?.usedSold?.min_price,
            max_price: item.salesData?.usedSold?.max_price,
            avg_price: item.salesData?.usedSold?.avg_price
          },
          newSold: {
            item: {no: item.salesData?.usedSold?.item.no},
            total_quantity: item.salesData?.newSold?.total_quantity,
            min_price: item.salesData?.newSold?.min_price,
            max_price: item.salesData?.newSold?.max_price,
            avg_price: item.salesData?.newSold?.avg_price
          }
        }} as Item;
      })}

    const savedQuote = {
      quote: transformedQuote,
      customerInfo: customerInfo,
      inputtedBy: inputtedBy,
      keyWords: keyWords?.toLowerCase().replace(', ', ',').split(','),
      date: date?.format('YYYY-MM-DD'),
    } as SavedQuote;
    await saveQuote(savedQuote).then(() => {
      addQuote(savedQuote);
      showSnackbar('Quote saved successfully!', 'success');
      closeAndReset();
    }).catch(() => {
      showSnackbar('Quote not saved successfully!', 'error');
    });
  }

  const closeAndReset = () => {
    setCustomerInfo('');
    // setInputtedBy('');
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
    </>
  );
}

export default React.memo(SaveQuoteDialog);
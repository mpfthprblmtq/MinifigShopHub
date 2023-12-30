import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Portal, Snackbar, TextField,
  Typography
} from "@mui/material";
import { useQuoteService } from "../../../../hooks/dynamo/useQuoteService";
import { SavedQuote } from "../../../../model/dynamo/SavedQuote";
import { Clear, Close } from "@mui/icons-material";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import QuoteCard from "./QuoteCard";

interface LoadQuoteDialogParams {
  open: boolean;
  onClose: () => void;
}

const LoadQuoteDialog: FunctionComponent<LoadQuoteDialogParams> = ({ open, onClose }) => {

  const { loadQuotes } = useQuoteService();

  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [masterQuotes, setMasterQuotes] = useState<SavedQuote[]>([]);

  const [searchBy, setSearchBy] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({ open: false });


  const closeAndReset = () => {
    resetFilters();
    onClose();
  };

  useEffect(() => {
    loadQuotes().then(quotes => {
      setQuotes(quotes);
      setMasterQuotes(quotes);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let filteredQuotes: SavedQuote[] = masterQuotes;
    if (searchBy) {
      const query: string = searchBy.toLowerCase();
      filteredQuotes = masterQuotes.filter(quote => {
        return (quote.customerInfo.toLowerCase().includes(query)
            || quote.keyWords.filter(keyWord => keyWord.toLowerCase().includes(query)).length > 0
            || quote.quote.items.map(item => item.name).filter(name => name.toLowerCase().includes(query)).length > 0
            || quote.quote.items.map(item => item.setId).filter(setId => setId?.includes(query)).length > 0
            || quote.inputtedBy.toLowerCase().includes(query))
          && (date ? quote.date === date.format("YYYY-MM-DD") : true);
      });
      setQuotes(filteredQuotes);
    } else if (date) {
      filteredQuotes = date.isValid() ?
        masterQuotes.filter(quote => quote.date === date.format("YYYY-MM-DD")) : [];
      setQuotes(filteredQuotes);
    } else {
      setQuotes(masterQuotes);
    }
    // eslint-disable-next-line
  }, [searchBy, date]);

  const resetFilters = () => {
    setSearchBy("");
    setDate(null);
  };

  return (
    <>
      <Dialog open={open} onClose={closeAndReset} PaperProps={{
        sx: {
          width: "50%",
          maxHeight: "80vh"
        }
      }}>
        <DialogTitle><Typography sx={{ fontFamily: "Didact Gothic", fontSize: "30px" }}>Load
          Quote</Typography></DialogTitle>
        <Box position="absolute" top={0} right={0} onClick={closeAndReset}>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography sx={{ fontFamily: "Didact Gothic", fontSize: "24px", marginBottom: "10px" }}>Search
            By</Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ m: 1, position: "relative" }}>
              <TextField
                sx={{ width: "250px", marginBottom: "20px" }}
                label={"Search Query"}
                value={searchBy}
                onChange={(event) => setSearchBy(event.target.value)}
                disabled={masterQuotes.length === 0} /><br />
            </Box>
            <Box sx={{ m: 1, position: "relative" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(date: any) => setDate(date)}
                  sx={{ width: "250px", marginBottom: "20px" }}
                  disabled={masterQuotes.length === 0} />
              </LocalizationProvider><br />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ position: "relative", m: 1 }}>
              <Typography sx={{ fontFamily: "Didact Gothic", fontSize: "20px" }}>
                {quotes && quotes.length > 0 ? `${quotes.length} ${quotes.length === 1 ? "quote" : "quotes"} found!`
                  : "No quotes found!"}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", m: 1 }}>
              <Button onClick={resetFilters} variant={"contained"} color={"error"} startIcon={<Clear />}
                      sx={{ margin: "5px" }} disabled={masterQuotes.length === 0}>Reset Filters</Button>
            </Box>
          </Box>
          {quotes.length !== 0 && (
            quotes
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((quote) => (
                <QuoteCard
                  quote={quote}
                  removeQuoteFromState={(quote: SavedQuote) =>
                    setQuotes([...quotes.filter(quoteInList => quote.id !== quoteInList.id)])}
                  setSnackbarState={setSnackbarState}
                  onClose={closeAndReset}
                  key={quote.id} />
              ))
          )}
        </DialogContent>
      </Dialog>
      <Portal>
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({ open: false })}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({ open: false })}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};

export default React.memo(LoadQuoteDialog);
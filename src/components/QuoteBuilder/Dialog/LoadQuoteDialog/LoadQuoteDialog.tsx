import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { useQuoteService } from "../../../../hooks/dynamo/useQuoteService";
import { Clear, Close } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import QuoteCard from "./QuoteCard";
import { SavedQuote } from "../../../../model/dynamo/SavedQuote";
import { SavedQuoteKey } from "../../../../model/dynamo/SavedQuoteKey";
import { Quote } from "../../../../model/quote/Quote";

interface LoadQuoteDialogParams {
  open: boolean;
  onClose: () => void;
  quote?: SavedQuote;
  loadQuote: (quote: Quote) => void;
}

const LoadQuoteDialog: FunctionComponent<LoadQuoteDialogParams> = ({ open, onClose, quote, loadQuote }) => {

  const { loadQuoteKeys } = useQuoteService();

  const [quoteKeys, setQuoteKeys] = useState<SavedQuoteKey[]>([]);
  const [masterQuoteKeys, setMasterQuoteKeys] = useState<SavedQuoteKey[]>([]);

  const [searchBy, setSearchBy] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);

  const closeAndReset = () => {
    resetFilters();
    onClose();
  };

  useEffect(() => {
    loadQuoteKeys().then(quoteKeys => {
      setQuoteKeys(quoteKeys);
      setMasterQuoteKeys(quoteKeys);
    });
    // eslint-disable-next-line
  }, [quote]);

  useEffect(() => {
    let filteredQuoteKeys: SavedQuoteKey[] = masterQuoteKeys;
    if (searchBy) {
      const query: string = searchBy.toLowerCase();
      filteredQuoteKeys = masterQuoteKeys.filter(quoteKey => {
        return (quoteKey.customerInfo.toLowerCase().includes(query)
            || quoteKey.keyWords.filter(keyWord => keyWord.toLowerCase().includes(query)).length > 0
            || quoteKey.sets.filter(set => set.toLowerCase().includes(query)).length > 0
            || quoteKey.inputtedBy.toLowerCase().includes(query))
          && (date ? quoteKey.date === date.format("YYYY-MM-DD") : true);
      });
      setQuoteKeys(filteredQuoteKeys);
    } else if (date) {
      filteredQuoteKeys = date.isValid() ?
        masterQuoteKeys.filter(quote => quote.date === date.format("YYYY-MM-DD")) : [];
      setQuoteKeys(filteredQuoteKeys);
    } else {
      setQuoteKeys(masterQuoteKeys);
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
                disabled={masterQuoteKeys.length === 0} /><br />
            </Box>
            <Box sx={{ m: 1, position: "relative" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(date: any) => setDate(date)}
                  sx={{ width: "250px", marginBottom: "20px" }}
                  disabled={masterQuoteKeys.length === 0} />
              </LocalizationProvider><br />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ position: "relative", m: 1 }}>
              <Typography sx={{ fontFamily: "Didact Gothic", fontSize: "20px" }}>
                {quoteKeys && quoteKeys.length > 0 ? `${quoteKeys.length} ${quoteKeys.length === 1 ? "quote" : "quotes"} found!`
                  : "No quotes found!"}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", m: 1 }}>
              <Button onClick={resetFilters} variant={"contained"} color={"error"} startIcon={<Clear />}
                      sx={{ margin: "5px" }} disabled={masterQuoteKeys.length === 0}>Reset Filters</Button>
            </Box>
          </Box>
          {quoteKeys.length !== 0 && (
            quoteKeys
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((quote) => (
                <QuoteCard
                  quoteKey={quote}
                  loadQuoteIntoApp={loadQuote}
                  removeQuoteFromState={(quoteKey: SavedQuoteKey) =>
                    setQuoteKeys([...quoteKeys.filter(quoteKeyInList => quoteKey.id !== quoteKeyInList.id)])}
                  onClose={closeAndReset}
                  key={quote.id} />
              ))
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(LoadQuoteDialog);
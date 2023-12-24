import React, { FunctionComponent, useState } from "react";
import { SavedQuote } from "../../../../model/dynamo/SavedQuote";
import { Box, Button, Card, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import TooltipConfirmationModal from "../../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { Delete, Info } from "@mui/icons-material";
import { updateQuoteInStore } from "../../../../redux/slices/quoteSlice";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useDispatch } from "react-redux";
import { useQuoteService } from "../../../../hooks/dynamo/useQuoteService";

interface QuoteCardParams {
  quote: SavedQuote;
  removeQuoteFromState: (quote: SavedQuote) => void;
  setSnackbarState: (snackbarState: SnackbarState) => void;
  onClose: () => void;
}

const QuoteCard: FunctionComponent<QuoteCardParams> = ({ quote, removeQuoteFromState, setSnackbarState, onClose }) => {

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { deleteQuote } = useQuoteService();


  return (
    <Card style={{ marginTop: "10px", backgroundColor: "#F5F5F5" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ m: 1, position: "relative" }}>
          <Typography>
            <strong>Customer Info: </strong>{quote.customerInfo}
          </Typography>
          <Typography sx={{whiteSpace: 'nowrap'}}>
            <strong>Items: </strong>{quote.quote.items.length}<span style={{marginLeft: '20px'}}><strong>Inputted By: </strong>{quote.inputtedBy}</span>
          </Typography>
          <Typography>
            <strong>Date: </strong>{dayjs(quote.date).format("LL")}
          </Typography>
        </Box>
        <Box sx={{ m: 1, position: "relative", display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={quote.quote.items.map((item) => (
              <Typography sx={{fontSize: '14px'}} key={item.id}>{`${item.setId} - ${item.name}`}</Typography>
            ))}
            placement={'right'}
            arrow>
            <Info sx={{fontSize: '40px', color: '#666666', marginRight: '10px'}}/>
          </Tooltip>
          <TooltipConfirmationModal
            open={confirmDeleteModalOpen}
            content={
              <Typography sx={{fontSize: '14px'}}>
                {'Are you sure you want to delete this quote?'}
              </Typography>}
            onConfirm={async () => {
              await deleteQuote(quote.id).then(() => {
                setSnackbarState({
                  open: true,
                  severity: 'success',
                  message: 'Quote deleted successfully!'
                } as SnackbarState);
                removeQuoteFromState(quote);
              }).catch(error => {
                setSnackbarState({
                  open: true,
                  severity: 'error',
                  message: `Couldn't delete quote: ${error.message}`
                } as SnackbarState);
              });
              setConfirmDeleteModalOpen(false);
            }}
            onClose={() => {
              setConfirmDeleteModalOpen(false);
            }}
            placement={'top'}
            confirmButtonText={'Delete'}
            arrow
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmDeleteModalOpen(true)}
              style={{ width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", marginRight: "5px" }}>
              <Delete />
            </Button>
          </TooltipConfirmationModal>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(updateQuoteInStore(quote.quote));
              onClose();
              setSnackbarState({
                open: true,
                severity: 'success',
                message: 'Quote loaded successfully!'
              } as SnackbarState);
            }}
            style={{ width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", marginRight: "5px" }}>
            <DriveFileMoveIcon />
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default QuoteCard;
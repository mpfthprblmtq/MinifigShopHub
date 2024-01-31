import React, { FunctionComponent, useState } from "react";
import { Box, Button, Card, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import TooltipConfirmationModal from "../../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { Delete, Info } from "@mui/icons-material";
import { updateQuoteInStore } from "../../../../redux/slices/quoteSlice";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useDispatch } from "react-redux";
import { useQuoteService } from "../../../../hooks/dynamo/useQuoteService";
import { SavedQuoteKey } from "../../../../model/dynamo/SavedQuoteKey";

interface QuoteCardParams {
  quoteKey: SavedQuoteKey;
  removeQuoteFromState: (quoteKey: SavedQuoteKey) => void;
  setSnackbarState: (snackbarState: SnackbarState) => void;
  onClose: () => void;
}

const QuoteCard: FunctionComponent<QuoteCardParams> = ({ quoteKey, removeQuoteFromState, setSnackbarState, onClose }) => {

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { deleteQuote } = useQuoteService();
  const { loadQuote } = useQuoteService();

  return (
    <Card style={{ marginTop: "10px", backgroundColor: "#F5F5F5" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ m: 1, position: "relative" }}>
          <Typography>
            <strong>Customer Info: </strong>{quoteKey.customerInfo}
          </Typography>
          <Typography sx={{whiteSpace: 'nowrap'}}>
            <strong>Items: </strong>{quoteKey.sets.length}<span style={{marginLeft: '20px'}}><strong>Inputted By: </strong>{quoteKey.inputtedBy}</span>
          </Typography>
          <Typography>
            <strong>Date: </strong>{dayjs(quoteKey.date).format("LL")}
          </Typography>
        </Box>
        <Box sx={{ m: 1, position: "relative", display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={quoteKey.sets.map((set: string, index: number) => (
              <Typography sx={{fontSize: '14px'}} key={index}>{set}</Typography>
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
              await deleteQuote(quoteKey.id).then(() => {
                setSnackbarState({
                  open: true,
                  severity: 'success',
                  message: 'Quote deleted successfully!'
                } as SnackbarState);
                removeQuoteFromState(quoteKey);
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
            onClick={async () => {
              await loadQuote(quoteKey.id).then(quote => {
                dispatch(updateQuoteInStore(quote.quote));
                onClose();
                setSnackbarState({
                  open: true,
                  severity: 'success',
                  message: 'Quote loaded successfully!'
                } as SnackbarState);
              })
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
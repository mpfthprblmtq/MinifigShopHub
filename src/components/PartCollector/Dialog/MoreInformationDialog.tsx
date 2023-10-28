import React, { FunctionComponent, useState } from "react";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Close, SquareRounded } from "@mui/icons-material";
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";

interface MoreInformationDialogParams {
  open: boolean;
  onClose: () => void;
  part: PartDisplay;
  onDelete: () => void;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, part, onDelete}) => {

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      sx: {
        width: "50%",
        maxHeight: '80vh',
      }
    }}>
      <DialogTitle>Details for {part.part.name}</DialogTitle>
      <Box position="absolute" top={0} right={0} onClick={onClose}>
        <IconButton>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <img width="200" alt="part-img" src={part.part.imageUrl}/>
          </Box>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Typography>
              <strong>Description: </strong><br/>{part.part.name}<br/>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
              <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
                <strong>Color: </strong>
              </Box>
              <Box sx={{ m: 1, position: 'relative', margin: 0, marginLeft: '5px', marginTop: '3px' }}>
                <SquareRounded sx={{ color: `#${part.part.color.rgb}` }} />
              </Box>
              <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
                {part.part.color.description}
              </Box>
            </Box>
            <Typography>
              <strong>Bricklink ID: </strong>
                <a target={'_blank'} rel={'noreferrer'}
                   href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${part.part.bricklinkId}&C=${part.part.color.id}`}>
                  {part.part.bricklinkId}
                </a>
            </Typography>
            <Typography>
              <strong>Quantity needed: </strong>{part.quantity}<br/>
            </Typography>
            <Typography sx={{ marginBottom: '10px' }}>
              <strong>Needed for set: </strong>{part.set}<br/>
            </Typography>
          </Box>
        </Box>
        {part.comment && (
          <Typography>
            <strong>Comment: </strong><br/>{part.comment}<br/>
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <TooltipConfirmationModal
          open={confirmDeleteModalOpen}
          content={
            <Typography sx={{fontSize: '14px'}}>
              {`Are you sure you want to delete ${part.part.name}?`}
            </Typography>}
          onConfirm={() => {
            onDelete();
            onClose();
          }}
          onClose={() => setConfirmDeleteModalOpen(false)}
          placement={'top'}
          confirmButtonText={'Delete'}
          arrow
        >
          <Button variant="contained" color="error" onClick={() => setConfirmDeleteModalOpen(true)}>
            Delete
          </Button>
        </TooltipConfirmationModal>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MoreInformationDialog;
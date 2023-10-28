import React, { FunctionComponent, useState } from "react";
import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import InformationDialog from "../../_shared/InformationDialog/InformationDialog";
import { Delete, InfoOutlined } from "@mui/icons-material";
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import MoreInformationDialog from "../Dialog/MoreInformationDialog";

interface PartTileParams {
  partDisplay: PartDisplay;
  deletePart: (part: PartDisplay) => void;
}

const PartTile: FunctionComponent<PartTileParams> = ({partDisplay, deletePart}) => {

  const [focusedImage, setFocusedImage] = useState<string | undefined>();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);
  const [moreInformationDialogOpen, setMoreInformationDialogOpen] = useState<boolean>(false);

  return (
    <Card sx={{ width: '200px', padding: '5px', margin: '5px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tooltip title={partDisplay.part.color.description}>
          <img src={partDisplay.part.imageUrl} width={75} alt={'part-img'} onClick={() => setFocusedImage(partDisplay.part.imageUrl)}/>
        </Tooltip>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Stack direction={'column'} sx={{textAlign: 'center'}}>
            <Typography sx={{ fontSize: 30 }}>{partDisplay.quantity}</Typography>
            <Typography sx={{ fontsize: 20 }}>{partDisplay.set}</Typography>
          </Stack>
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Stack direction={'column'} sx={{textAlign: 'center'}}>
            <Box onClick={() => setMoreInformationDialogOpen(true)} className={'clickable'}>
              <Tooltip title={"More Details"}>
                <InfoOutlined sx={{fontSize: '28px'}} color={"primary"} />
              </Tooltip>
            </Box>
            <Box sx={{ position: 'relative', margin: 0 }} className={"clickable"} onClick={() => setConfirmDeleteModalOpen(true)}>
              <TooltipConfirmationModal
                open={confirmDeleteModalOpen}
                content={
                  <Typography sx={{fontSize: '14px'}}>
                    {`Are you sure you want to delete ${partDisplay.part.name}?`}
                  </Typography>}
                onConfirm={() => deletePart(partDisplay)}
                onClose={() => setConfirmDeleteModalOpen(false)}
                placement={'top'}
                confirmButtonText={'Delete'}
                arrow
              >
                <Delete sx={{fontSize: '32px'}} color={"error"} />
              </TooltipConfirmationModal>
            </Box>
          </Stack>
        </Box>
      </Box>
      <InformationDialog
        open={!!focusedImage}
        onClose={() => setFocusedImage(undefined)}
        title={''}
        content={<img src={focusedImage} alt="part-img" />}
      />
      <MoreInformationDialog
        open={moreInformationDialogOpen}
        onClose={() => setMoreInformationDialogOpen(false)}
        part={partDisplay}
        onDelete={() => deletePart(partDisplay)}
      />
    </Card>
  );
}

export default PartTile;
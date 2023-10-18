import React, { FunctionComponent, useState } from "react";
import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import InformationDialog from "../../_shared/InformationDialog/InformationDialog";
import { Delete, InfoOutlined, SquareRounded } from "@mui/icons-material";
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import { truncateString } from "../../../utils/StringUtils";

interface PartTileParams {
  partDisplay: PartDisplay;
}

const PartTile: FunctionComponent<PartTileParams> = ({partDisplay}) => {

  const [focusedImage, setFocusedImage] = useState<string | undefined>();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);

  console.log(partDisplay)

  const onShowMoreInfo = () => {
    alert('More Info on part:\n' + partDisplay.part.name)
  }

  const onDelete = () => {
    alert('Deleting part:\n' + partDisplay.part.name)
  }

  return (
    <Card sx={{ width: '350px', padding: '5px', margin: '5px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={partDisplay.part.imageUrl} width={75} alt={'part-img'} onClick={() => setFocusedImage(partDisplay.part.imageUrl)}/>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Stack direction={'column'} sx={{textAlign: 'center'}}>
            <Typography sx={{ fontSize: 30 }}>{partDisplay.quantity}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ m: 1, position: 'relative', marginTop: 0, marginBottom: 0 }}>
                <Tooltip title={partDisplay.part.color.description}>
                  <SquareRounded sx={{ color: `#${partDisplay.part.color.rgb}`, padding: 0, margin: 0 }} />
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ m: 1, position: 'relative', marginTop: 0, marginBottom: 0 }}>
          <Stack direction={'column'} sx={{textAlign: 'center'}}>
            <Typography sx={{ fontSize: 15, textAlign: 'left' }}>{truncateString(partDisplay.part.name, 35)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
                <a target={'_blank'} rel={'noreferrer'}
                   href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${partDisplay.part.bricklinkId}&C=${partDisplay.part.color.id}`}>
                  {partDisplay.part.bricklinkId}
                </a>
              </Box>
              <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
                {partDisplay.set}
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Stack direction={'column'} sx={{textAlign: 'center'}}>
            <Box onClick={onShowMoreInfo} className={'clickable'}>
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
                onConfirm={onDelete}
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
        {/*<Box sx={{ m: 1, position: 'relative' }}>*/}
        {/*  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>*/}
        {/*    {partDisplay.part.name}*/}
        {/*    <Box sx={{ m: 1, position: 'relative' }}>*/}
        {/*      <a target={'_blank'} rel={'noreferrer'}*/}
        {/*         href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${partDisplay.part.id}&C=${partDisplay.part.color.id}`}>*/}
        {/*        {partDisplay.part.bricklinkId}*/}
        {/*      </a>*/}
        {/*    </Box>*/}
        {/*    <Box sx={{ m: 1, position: 'relative' }}>*/}
        {/*      {partDisplay.set}*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Box>
      <InformationDialog
        open={!!focusedImage}
        onClose={() => setFocusedImage(undefined)}
        title={''}
        content={<img src={focusedImage} alt="part-img" />}
      />
    </Card>
  );
}

export default PartTile;
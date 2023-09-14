import React, { FunctionComponent, useState } from "react";
import {Item} from "../../../../model/item/Item";
import { Box, Tooltip, Typography } from "@mui/material";
import {Delete, InfoOutlined, Bookmarks} from "@mui/icons-material";
import {Source} from "../../../../model/_shared/Source";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import TooltipConfirmationModal from "../../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";

interface IconsCellParams {
    item: Item;
    onDelete: (id: number) => void;
    onShowMoreInfo: () => void;
    onAddToLabel: () => void;
}

const IconsCell: FunctionComponent<IconsCellParams> = ({item, onDelete, onShowMoreInfo, onAddToLabel}) => {

    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);

    return (
        <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '20px !important' }}>
                <Box sx={{
                    m: 1,
                    position: 'relative',
                    padding: '5px',
                    margin: 0
                }} className={"clickable"} onClick={() => setConfirmDeleteModalOpen(true)}>
                    <TooltipConfirmationModal
                      open={confirmDeleteModalOpen}
                      content={
                        <Typography sx={{fontSize: '14px'}}>
                          {`Are you sure you want to delete ${item.setId ? item.setId : 'this item'}?`}
                        </Typography>}
                      onConfirm={() => onDelete(item.id)}
                      onClose={() => setConfirmDeleteModalOpen(false)}
                      placement={'top'}
                      confirmButtonText={'Delete'}
                      arrow
                    >
                        <Delete sx={{fontSize: '32px'}} color={"error"} />
                    </TooltipConfirmationModal>
                </Box>
                {item.sources?.includes(Source.BRICKLINK) && (
                  <>
                      <Box sx={{ m: 1, position: 'relative', padding: '5px', margin: 0 }} className={"clickable"}>
                          <Tooltip title={"Add To Label"}>
                              <Bookmarks sx={{fontSize: '28px'}} color={"primary"} onClick={onAddToLabel}/>
                          </Tooltip>
                      </Box>
                      <Box sx={{ m: 1, position: 'relative', padding: '5px', margin: 0 }} className={"clickable"}>
                          <Tooltip title={"More Details"}>
                              <InfoOutlined sx={{fontSize: '28px'}} color={"primary"} onClick={onShowMoreInfo}/>
                          </Tooltip>
                      </Box>
                  </>
                )}
            </Box>
        </StyledTableCell>
    );
};

export default React.memo(IconsCell);
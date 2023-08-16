import React, { FunctionComponent, useState } from "react";
import {Item} from "../../../../model/item/Item";
import {Box, Tooltip} from "@mui/material";
import {Delete, InfoOutlined} from "@mui/icons-material";
import {Source} from "../../../../model/_shared/Source";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import TooltipConfirmationModal from "../../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";

interface IconsCellParams {
    item: Item;
    onDelete: (id: number) => void;
    onShowMoreInfo: () => void;
}

const IconsCell: FunctionComponent<IconsCellParams> = ({item, onDelete, onShowMoreInfo}) => {

    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);

    return (
        <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative', padding: 0, margin: 0}} className={"clickable"} onClick={() => setConfirmDeleteModalOpen(true)}>
                    <TooltipConfirmationModal
                      open={confirmDeleteModalOpen}
                      text={`Are you sure you want to delete ${item.no ? item.no : 'this item'}?`}
                      onConfirm={() => onDelete(item.id)}
                      onClose={() => setConfirmDeleteModalOpen(false)}
                      placement={'top'}
                      confirmButtonText={'Delete'}
                      arrow
                    >
                        <Delete fontSize={"large"} color={"error"} />
                    </TooltipConfirmationModal>
                </Box>
                {item.source === Source.BRICKLINK && (
                    <Box sx={{ m: 1, position: 'relative', padding: 0, margin: 0 }} className={"clickable"}>
                        <Tooltip title={"More Details"}>
                            <InfoOutlined fontSize={"large"} color={"primary"} onClick={onShowMoreInfo}/>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </StyledTableCell>
    );
};

export default React.memo(IconsCell);
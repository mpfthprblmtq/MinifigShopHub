import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
import {Box, Tooltip} from "@mui/material";
import {Delete, InfoOutlined} from "@mui/icons-material";
import {Source} from "../../../../model/_shared/Source";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface IconsCellParams {
    item: Item;
    onDelete: () => void;
    onShowMoreInfo: () => void;
}

const IconsCell: FunctionComponent<IconsCellParams> = ({item, onDelete, onShowMoreInfo}) => {
    return (
        <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative', padding: 0, margin: 0}} className={"clickable"}>
                    <Tooltip title={"Delete Row"}>
                        <Delete fontSize={"large"} color={"error"} onClick={onDelete} />
                    </Tooltip>
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

export default IconsCell;
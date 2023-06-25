import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import {Tooltip} from "@mui/material";
import {Delete, PlaylistAdd} from "@mui/icons-material";
import {Source} from "../../../model/shared/Source";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface IconsCellParams {
    item: Item;
    onDelete: () => void;
    onShowMoreInfo: () => void;
}

const IconsCell: FunctionComponent<IconsCellParams> = ({item, onDelete, onShowMoreInfo}) => {
    return (
        <StyledTableCell>
            <Tooltip title={"Delete Row"} className={"clickable"}>
                <Delete fontSize={"large"} color={"error"} style={{padding: "5px"}} onClick={onDelete} />
            </Tooltip>
            {item.source === Source.BRICKLINK && (
                <Tooltip title={"More Details"} className={"clickable"}>
                    <PlaylistAdd fontSize={"large"} color={"primary"} style={{padding: "5px"}} onClick={onShowMoreInfo}/>
                </Tooltip>
            )}
        </StyledTableCell>
    );
};

export default IconsCell;
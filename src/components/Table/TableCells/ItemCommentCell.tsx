import React, {FunctionComponent, useState} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {Item} from "../../../model/item/Item";
import {Check, EditNote} from "@mui/icons-material";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface ItemCommentParams {
    item: Item;
    storeMode: boolean;
    handleCommentChange: (event: any, id: number) => void;
}
const ItemCommentCell: FunctionComponent<ItemCommentParams> = ({item, storeMode, handleCommentChange}) => {

    const [editing, setEditing] = useState<boolean>(false);

    return (
        <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {storeMode && (
                    <Box sx={{ m: 1, position: 'relative' }} className={"clickable"} onClick={() => setEditing(!editing)}>
                        {editing ? <Check color={"success"} /> : <EditNote color={"primary"} />}
                    </Box>
                )}
                <Box sx={{ m: 1, position: 'relative' }}>
                    {storeMode ? (
                        editing ?
                            <TextField
                                size="small"
                                value={item.comment}
                                onChange={(event: any) => handleCommentChange(event, item.id)}/>
                            : <Typography fontSize={"inherit"}>{item.comment}</Typography>
                    ) : <Typography fontSize={"inherit"}>{item.comment}</Typography>}
                </Box>
            </Box>
        </StyledTableCell>
    );
}

export default ItemCommentCell;
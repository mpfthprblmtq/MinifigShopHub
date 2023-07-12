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
    const [comment, setComment] = useState<string>(item.comment ?? '');

    const submitCommentChanges = () => {
        setEditing(!editing);
        handleCommentChange(comment, item.id);
    }

    return (
        <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {storeMode && (
                    <Box sx={{ m: 1, position: 'relative' }} className={"clickable"} onClick={submitCommentChanges}>
                        {editing ? <Check color={"success"} /> : <EditNote color={"primary"} />}
                    </Box>
                )}
                <Box sx={{ m: 1, position: 'relative' }}>
                    {storeMode ? (
                        editing ?
                            <TextField
                                size="small"
                                value={comment}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitCommentChanges();
                                    }
                                }}
                                onChange={(event: any) => {
                                    setComment(event.target.value);
                                }}
                            />
                            : <Typography fontSize={"inherit"}>{item.comment}</Typography>
                    ) : <Typography fontSize={"inherit"}>{item.comment}</Typography>}
                </Box>
            </Box>
        </StyledTableCell>
    );
}

export default ItemCommentCell;
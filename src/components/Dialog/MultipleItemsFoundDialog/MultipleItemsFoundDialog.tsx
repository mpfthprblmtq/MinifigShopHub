import React, {FunctionComponent, useEffect, useState} from "react";
import {Item} from "../../../model/item/Item";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Typography
} from "@mui/material";

interface MultipleItemsFoundDialogParams {
    open: boolean;
    onClose: () => void;
    items: Item[];
    addItem: (item: Item) => void;
}

const MultipleItemsFoundDialog: FunctionComponent<MultipleItemsFoundDialogParams> = ({open, onClose, items, addItem}) => {

    const [multipleMatchItemsHeader, setMultipleMatchItemsHeader] = useState<string>('');

    useEffect(() => {
        if (items.length === 1) {
            setMultipleMatchItemsHeader(items[0].no?.replace("-1", "") ?? '');
        } else if (items.length > 1) {
            const setNumbers: string[] = [];
            for (const item of items) {
                setNumbers.push(item.no?.split('-')[0] ?? '');
            }
            setMultipleMatchItemsHeader(
                setNumbers
                    .filter((setNumber, index) => setNumbers.indexOf(setNumber) === index)
                    .join(", "));
        }
    }, [items]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth disableScrollLock={true}>
            <DialogTitle>
                <Typography style={{fontFamily: 'Didact Gothic', fontSize: '20px', marginBottom: '-20px'}}>
                    Multiple items found for {multipleMatchItemsHeader}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List>
                    {items.map((item, index) => (
                        <div key={index}>
                            <ListItem>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                                    <Box sx={{ m: 1, position: 'relative' }}>
                                        <img src={item.image_url} width={100} alt={'bricklink-img'} />
                                    </Box>
                                    <Box sx={{ m: 1, position: 'relative', flexGrow: 4 }}>
                                        <Typography>{item.no}</Typography>
                                        <Typography>{item.name}</Typography>
                                    </Box>
                                    <Box sx={{ m: 1, position: 'relative' }}>
                                        <Button variant='contained' color='success' onClick={() => addItem(item)}>Add</Button>
                                    </Box>
                                </Box>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
};

export default MultipleItemsFoundDialog;
import React, {FunctionComponent, useEffect, useState} from "react";
import {Item} from "../../../../model/item/Item";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    Typography
} from "@mui/material";
import ItemRow from "./ItemRow";

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
            setMultipleMatchItemsHeader(items[0].setId?.replace("-1", "") ?? '');
        } else if (items.length > 1) {
            const setNumbers: string[] = [];
            for (const item of items) {
                setNumbers.push(item.setId?.split('-')[0] ?? '');
            }
            setMultipleMatchItemsHeader(
                setNumbers
                    .filter((setNumber, index) => setNumbers.indexOf(setNumber) === index)
                    .join(", "));
        }
    }, [items]);

    const shouldCloseOnAdd = (): boolean => {
        const setNumbers = items.map(item => item.setId?.split('-')[0] ?? '');
        const uniqueSetNumbers = setNumbers
          .filter((setNumber, index) => setNumbers.indexOf(setNumber) === index);
        return uniqueSetNumbers.length === 1;
    }

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
                        <ItemRow item={item} addItem={(item: Item) => {
                            addItem(item);
                            if (shouldCloseOnAdd()) {
                                onClose();
                            }
                        }} key={index} />
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
};

export default React.memo(MultipleItemsFoundDialog);
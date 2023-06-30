import React, {FunctionComponent, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextareaAutosize,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {cleanTextAreaList, getNumberFromResponseUrl} from "../../../utils/StringUtils";
import {Item} from "../../../model/item/Item";
import {useItemLookupService} from "../../../services/useItemLookupService";
import {AxiosError} from "axios";

interface BulkLoadDialogParams {
    open: boolean;
    onClose: () => void;
    addToItems: (items: Item[]) => void;
}

const BulkLoadDialog: FunctionComponent<BulkLoadDialogParams> = ({open, onClose, addToItems}) => {

    const [setNumbers, setSetNumbers] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);
    const { getHydratedItem } = useItemLookupService();

    const loadItems = async () => {
        const setNumberList: string[] = cleanTextAreaList(setNumbers).split(',');
        const items: Item[] = [];
        const errorItems: AxiosError[] = [];

        while(setNumberList.length) {
            // 5 at a time
            await Promise.all(
                setNumberList
                    .splice(0,5)                   // handle 5 at a time
                    .map(setNumber => getHydratedItem(setNumber))   // actual API call
                    .map(p => p.catch(e => e)))                     // custom handler to set the response to the error
                .then(responses => {
                    responses.forEach(response => {
                        // check to see if the response type is an error or an item like we want
                        if (response instanceof AxiosError) {
                            errorItems.push(response);
                        } else {
                            items.push(response);
                        }
                    });
                }).catch(error => {
                    console.error(error);
                });
        }

        // add the items that worked to the items list
        addToItems(items);

        // grabbing the set numbers from the error objects
        const errorSetNumbers: string[] = errorItems.map(e => getNumberFromResponseUrl(e.request.responseURL));

        // close if there are no errors
        if (errorSetNumbers.length === 0) {
            setHasError(false);
            setSetNumbers('');
            onClose();
        } else {
            setHasError(true);
            setSetNumbers(errorSetNumbers.join('\r\n'));
        }
    }

    return (
        <Dialog open={open} onClose={onClose}
                PaperProps={{
                    sx: {
                        width: "50vh",
                        maxHeight: '50vh',
                        height: '50vh'
                    }
                }}>
            <DialogTitle>
                <Typography style={{fontFamily: 'Didact Gothic', fontSize: '20px', marginBottom: '-20px'}}>
                    Bulk Load Items
                </Typography>
            </DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                {hasError ? (
                    <Typography color={'error'} style={{fontFamily: 'Didact Gothic', fontSize: '16px'}}>
                        These sets weren't found!<br/>Please correct them or remove them from the list.
                    </Typography>
                ) : <Typography>&nbsp;<br/>&nbsp;</Typography>}
                <TextareaAutosize
                    value={setNumbers}
                    minRows={5}
                    placeholder={'Enter set numbers, separated by either new lines or commas'}
                    onChange={(event) => setSetNumbers(event.target.value)}
                    style={{fontFamily: 'Didact Gothic', fontSize: '18px', height: '85%', width: '100%', resize: 'none'}}
                />
            </DialogContent>
            <DialogActions style={{marginBottom: 10}}>
                <Button variant="contained" onClick={() => {
                    setSetNumbers('');
                    onClose();
                }}>
                    Cancel
                </Button>
                <Button color={"success"} variant="contained" onClick={loadItems}>
                    Search
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default BulkLoadDialog;
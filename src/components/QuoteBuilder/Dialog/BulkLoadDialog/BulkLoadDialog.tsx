import React, {FunctionComponent, useState} from "react";
import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextareaAutosize,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {cleanTextAreaList, getNumberFromResponseUrl} from "../../../../utils/StringUtils";
import {Item} from "../../../../model/item/Item";
import {useItemLookupService} from "../../../../hooks/useItemLookupService";
import {AxiosError} from "axios";
import {green} from "@mui/material/colors";

interface BulkLoadDialogParams {
    open: boolean;
    onClose: () => void;
    addItems: (items: Item[]) => void;
    addMultipleMatchItems: (items: Item[]) => void;
}

const BulkLoadDialog: FunctionComponent<BulkLoadDialogParams> = ({open, onClose, addItems, addMultipleMatchItems}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [setNumbers, setSetNumbers] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);
    const { getItemMatches, getHydratedItem } = useItemLookupService();

    const loadItems = async () => {
        setLoading(true);
        const setNumberList: string[] =
            cleanTextAreaList(setNumbers).split(',').filter(setNumber => setNumber);
        const items: Item[] = [];
        const itemsWithMultipleMatches: Item[] = [];
        const errorItems: AxiosError[] = [];

        while(setNumberList.length) {
            // 5 at a time
            await Promise.all(
                setNumberList
                    .splice(0,5)
                    .map(setNumber =>
                        getItemMatches(setNumber)
                        // getHydratedItem(setNumber)
                    )
                    .map(p => p.catch(e => e)))
                .then(responses => {
                    responses.forEach(response => {
                        // check to see if the response type is an error or an item like we want
                        if (response instanceof AxiosError) {
                            errorItems.push(response);
                        } else {
                            if (response.length === 1) {
                                items.push(response[0]);
                            } else {
                                itemsWithMultipleMatches.push(...response);
                            }
                        }
                    });
                }).catch(error => {
                    console.error(error);
                });
        }

        // add the items that worked to the items list
        const hydratedItems: Item[] = [];
        for (const item of items) {
            await getHydratedItem(item).then(hydratedItem => hydratedItems.push(hydratedItem));
        }
        addItems(hydratedItems);

        // add the items with multiple matches
        addMultipleMatchItems(itemsWithMultipleMatches);

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
        setLoading(false);
    }

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock={true}
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
                <Button
                    variant="contained"
                    disabled={loading}
                    onClick={() => {
                        setSetNumbers('');
                        onClose();
                    }}>
                    Cancel
                </Button>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        color={"success"}
                        variant="contained"
                        onClick={loadItems}
                        disabled={loading}>
                        Search
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={20}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-10px',
                                marginLeft: '-10px',
                            }}
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    )
};

export default BulkLoadDialog;
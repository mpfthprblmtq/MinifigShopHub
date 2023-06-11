import React, {FunctionComponent, useEffect, useState} from "react";
import {Item} from "../../../model/item/Item";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {useBrickLinkService} from "../../../services/useBrickLinkService";
import SalesHistoryAccordion from "./SalesHistoryAccordion";

interface MoreInformationDialogParams {
    open: boolean;
    onClose: () => void;
    item?: Item;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, item}) => {

    const [category, setCategory] = useState<string>('');

    const { getCategory } = useBrickLinkService();
    useEffect(() => {
        if (item?.category_id) {
            getCategory(item.category_id).then((category) => setCategory(category.category_name));
        }
        // eslint-disable-next-line
    }, [item]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Item Details for {item?.no}</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item?.image_url && item?.thumbnail_url && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <img width="150" alt="bricklink-set-img" src={item.image_url}/>
                        </Box>
                    )}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>
                            <strong>Set ID: </strong>{item?.no}<br/>
                            <strong>Name: </strong>{item?.name}<br/>
                            <strong>Year: </strong>{item?.year_released}<br/>
                            <strong>Category: </strong>{category}<br/>
                        </Typography>
                    </Box>
                </Box>
                <SalesHistoryAccordion
                    title={<Typography>Last 6 Months Sales <strong>(New)</strong></Typography>}
                    salesHistory={item?.newSold} />
                <SalesHistoryAccordion
                    title={<Typography>Last 6 Months Sales <strong>(Used)</strong></Typography>}
                    salesHistory={item?.usedSold} />
                <SalesHistoryAccordion
                    title={<Typography>Current Items For Sale <strong>(New)</strong></Typography>}
                    salesHistory={item?.newStock} />
                <SalesHistoryAccordion
                    title={<Typography>Current Items For Sale <strong>(Used)</strong></Typography>}
                    salesHistory={item?.usedStock} />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MoreInformationDialog;
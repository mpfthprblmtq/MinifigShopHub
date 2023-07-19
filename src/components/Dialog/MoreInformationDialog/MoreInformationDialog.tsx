import React, {FunctionComponent} from "react";
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
import SalesHistoryAccordion from "./SalesHistoryAccordion";
import {formatCurrency} from "../../../utils/CurrencyUtils";

interface MoreInformationDialogParams {
    open: boolean;
    onClose: () => void;
    item?: Item;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, item}) => {

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{
            sx: {
                width: "50%",
                maxHeight: '80vh',
                height: '80vh'
            }
        }}>
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
                            <img width="200" alt="bricklink-set-img" src={item.image_url}/>
                        </Box>
                    )}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>
                            <strong>Set ID: </strong>{item?.no}<br/>
                            <strong>Name: </strong>{item?.name}<br/>
                            <strong>Year: </strong>{item?.year_released}<br/>
                            <strong>Category: </strong>{item?.category_name}<br/>
                        </Typography>
                        {item?.retailStatus?.availability && item.retailStatus.retailPrice && (
                            <Typography style={{marginTop: 10}}>
                                <strong>Availability: </strong>{item?.retailStatus?.availability}<br/>
                                <strong>MSRP: </strong>{formatCurrency(item?.retailStatus?.retailPrice)}<br/>
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box marginTop={'10px'}>
                    {item?.newSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(New)</strong></Typography>}
                            salesHistory={item?.newSold} />
                    )}
                    {item?.usedSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(Used)</strong></Typography>}
                            salesHistory={item?.usedSold} />
                    )}
                    {item?.newStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(New)</strong></Typography>}
                            salesHistory={item?.newStock} />
                    )}
                    {item?.usedStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(Used)</strong></Typography>}
                            salesHistory={item?.usedStock} />
                    )}
                </Box>
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
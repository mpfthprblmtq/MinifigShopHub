import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
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
import {formatCurrency} from "../../../../utils/CurrencyUtils";

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
            <DialogTitle>Item Details for {item?.setId}</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item?.imageUrl && item?.thumbnailUrl && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <img width="200" alt="bricklink-set-img" src={item.imageUrl}/>
                        </Box>
                    )}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>
                            <strong>Set ID: </strong>{item?.setId}<br/>
                            <strong>Name: </strong>{item?.name}<br/>
                            <strong>Year: </strong>{item?.yearReleased}<br/>
                            {item?.pieceCount && item.minifigCount && (
                              <>
                                  <strong>Pieces / Minifigs: </strong>
                                    {`${item?.pieceCount?.toLocaleString() ?? 0} / ${item?.minifigCount?.toLocaleString() ?? 0}`}<br/>
                              </>
                            )}
                            {item?.theme && item.subTheme && (
                              <>
                                  <strong>Theme: </strong>{item?.theme}<br/>
                                  <strong>SubTheme: </strong>{item?.subTheme}<br/>
                              </>
                            )}
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
                    {item?.salesData?.newSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesData?.newSold} />
                    )}
                    {item?.salesData?.usedSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesData?.usedSold} />
                    )}
                    {item?.salesData?.newStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesData?.newStock} />
                    )}
                    {item?.salesData?.usedStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesData?.usedStock} />
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
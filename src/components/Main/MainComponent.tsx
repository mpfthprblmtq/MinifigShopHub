import React, {FunctionComponent, useRef, useState} from "react";
import {Item} from "../../model/item/Item";
import {Box, Typography} from "@mui/material";
import TableComponent from "../Table/TableComponent/TableComponent";
import ItemSearchCard from "../Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "../Cards/CustomItemCard/CustomItemCard";
import Totals from "../Totals/Totals";
import ConfigurationCard from "../Cards/ConfigurationCard/ConfigurationCard";
import BrickLinkSearchCard from "../Cards/BrickLinkSearchCard/BrickLinkSearchCard";
import {formatCurrency} from "../../utils/CurrencyUtils";
import Version from "./Version";
import {Condition} from "../../model/shared/Condition";
import SettingsDialog from "../Dialog/SettingsDialog/SettingsDialog";
import ConfirmDialog from "../_shared/ConfirmDialog/ConfirmDialog";

interface TotalsRefProps {
    resetTotalsCalculations: () => void;
}

const MainComponent: FunctionComponent = () => {

    const totalsRef = useRef({} as TotalsRefProps);
    const [items, setItems] = useState<Item[]>([]);
    const [storeMode, setStoreMode] = useState<boolean>(true);
    const [showConfirmResetCalculationsDialog, setShowConfirmResetCalculationsDialog] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

    const resetCalculations = () => {
        items.forEach(item => {
            item.valueAdjustment = item.condition === Condition.USED ?
                +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! * 100 :
                +process.env.REACT_APP_AUTO_ADJUST_VALUE_NEW! * 100;
            item.value = item.baseValue * (item.valueAdjustment / 100);
            item.valueDisplay = formatCurrency(item.value).toString().substring(1);
        });
        totalsRef.current.resetTotalsCalculations();
    };

    const setBulkCondition = (condition: Condition) => {
        items.forEach(item => {
            // if we're changing from used to new, and the existing valueAdjustment is the valueAdjustment for used,
            // then change the valueAdjustment to the valueAdjustment for new
            if (item.condition === Condition.USED && condition === Condition.NEW &&
                item.valueAdjustment === +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! * 100) {
                item.valueAdjustment = +process.env.REACT_APP_AUTO_ADJUST_VALUE_NEW! * 100;
            // if we're changing from new to used, and the existing valueAdjustment is the valueAdjustment for new,
            // then change the valueAdjustment to the valueAdjustment for used
            } else if (item.condition === Condition.NEW && condition === Condition.USED &&
                item.valueAdjustment === +process.env.REACT_APP_AUTO_ADJUST_VALUE_NEW! * 100) {
                item.valueAdjustment = +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! * 100;
            } else {
                // else just leave the value adjustment as it is
            }

            item.condition = condition;
            item.value = item.baseValue * (item.valueAdjustment / 100);
            item.valueDisplay = formatCurrency(item.value).toString().substring(1);
        });
        setItems([...items]);
    };

    return (
        <div className={"App"}>
            <h1>QuoteBuilder</h1>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {storeMode && (
                        <>
                            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                                <ItemSearchCard items={items} setItems={setItems} />
                            </Box>
                            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                                <CustomItemCard items={items} setItems={setItems} />
                            </Box>
                            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                                <BrickLinkSearchCard />
                            </Box>
                        </>
                    )}
                </Box>
            <Box style={{marginTop: 20}}>
                <TableComponent items={items} setItems={setItems} storeMode={storeMode} />
            </Box>
            <Box>
                <Box style={{position: 'absolute', marginTop: 20}}>
                    <ConfigurationCard
                        storeMode={storeMode}
                        setStoreMode={setStoreMode}
                        buttonsDisabled={!items || items.length === 0}
                        setSettingsDialogOpen={setSettingsDialogOpen}
                    />
                </Box>
            </Box>
            {items.length > 0 && (
                <Totals items={items} storeMode={storeMode} ref={totalsRef} />
            )}
            <ConfirmDialog
                title='Confirm Reset Calculations'
                confirmText='Reset'
                confirmButtonColor='error'
                open={showConfirmResetCalculationsDialog}
                onClose={() => setShowConfirmResetCalculationsDialog(false)}
                onConfirm={() => {
                    setShowConfirmResetCalculationsDialog(false);
                    resetCalculations();
                }}
                content={<Typography>Are you sure you want to reset all calculations?  This cannot be undone.</Typography>}
            />
            <SettingsDialog
                open={settingsDialogOpen}
                onClose={() => setSettingsDialogOpen(false)}
                resetCalculations={() => setShowConfirmResetCalculationsDialog(true)}
                setBulkCondition={(condition) => {setBulkCondition(condition)}}
                actionsDisabled={items.length === 0}
            />
            <Version />
        </div>
    );
};

export default MainComponent;
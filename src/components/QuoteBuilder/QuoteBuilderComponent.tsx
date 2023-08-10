import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Item } from "../../model/item/Item";
import {
    Box,
    Typography
} from "@mui/material";
import TableComponent from "./Table/TableComponent/TableComponent";
import ItemSearchCard from "./Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "./Cards/CustomItemCard/CustomItemCard";
import Totals from "./Totals/Totals";
import BrickLinkSearchCard from "./Cards/BrickLinkSearchCard/BrickLinkSearchCard";
import { formatCurrency } from "../../utils/CurrencyUtils";
import Version from "../_shared/Version/Version";
import { Condition } from "../../model/_shared/Condition";
import SettingsDialog from "./Dialog/SettingsDialog/SettingsDialog";
import ConfirmDialog from "../_shared/ConfirmDialog/ConfirmDialog";
import { usePriceCalculationEngine } from "../../hooks/priceCalculation/usePriceCalculationEngine";
import { ChangeType } from "../../model/priceCalculation/ChangeType";
import { useDispatch, useSelector } from "react-redux";
import { useConfigurationService } from "../../hooks/dynamo/useConfigurationService";
import { updateStoreConfiguration } from "../../redux/slices/configurationSlice";
import NavBar from "../_shared/NavBar/NavBar";
import { Tabs } from "../_shared/NavBar/Tabs";
import { Total } from "../../model/total/Total";
import { quoteSlice, updateItemsInStore, updateTotalInStore } from "../../redux/slices/quoteSlice";
import { Quote } from "../../model/quote/Quote";

interface TotalsRefProps {
    resetTotalsCalculations: () => void;
}

const QuoteBuilderComponent: FunctionComponent = () => {

    const { configuration } = useSelector((state: any) => state.configurationStore);
    const { quote } = useSelector((state: any) => state.quoteStore);
    const items = quote.items as Item[];
    const dispatch = useDispatch();

    const totalsRef = useRef({} as TotalsRefProps);
    const [total, setTotal] = useState<Total>(quote.total);
    const [storeMode, setStoreMode] = useState<boolean>(true);
    const [overrideRowAdjustments, setOverrideRowAdjustments] = useState<boolean>(false);
    const [showConfirmResetCalculationsDialog, setShowConfirmResetCalculationsDialog] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

    const { calculatePrice } = usePriceCalculationEngine();
    const { initConfig } = useConfigurationService();



    useEffect(() => {
        dispatch(updateTotalInStore({ ...total }));
        // eslint-disable-next-line
    }, [total]);

    const resetCalculations = () => {
        items.forEach(item => {
            item.valueAdjustment = item.condition === Condition.USED ?
                configuration.autoAdjustmentPercentageUsed : configuration.autoAdjustmentPercentageNew;
            item.value = item.baseValue * (item.valueAdjustment / 100);
            item.valueDisplay = formatCurrency(item.value).toString().substring(1);
        });
        totalsRef.current.resetTotalsCalculations();
    };

    const setBulkCondition = (condition: Condition) => {
        items.forEach(item => {
            item.condition = condition;
            calculatePrice(item, ChangeType.CONDITION);
        });
        dispatch((updateItemsInStore([...items])));
    };

    useEffect(() => {
        const initConfiguration = async () => {
            await initConfig().then(config => {
                dispatch(updateStoreConfiguration(config));
            }).catch(error => {
                console.error(error);
            });
        }
        if (!configuration.storeCreditValueAdjustment
            && !configuration.autoAdjustmentPercentageNew
            && !configuration.autoAdjustmentPercentageUsed) {
            initConfiguration().then(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={"App"}>
            <div className={"hide-in-print-preview"}>
                <NavBar
                    activeTab={Tabs.QUOTE_BUILDER}
                    openSettings={() => setSettingsDialogOpen(true)}
                    printQuote={() => {
                        if (items && items.length > 0) {
                            window.print();
                        }
                    }}
                    storeMode={storeMode}
                    setStoreMode={setStoreMode}
                />
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {storeMode && (
                    <>
                        <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                            <ItemSearchCard items={items} setItems={items => dispatch((updateItemsInStore([...items])))}
                            />
                        </Box>
                        <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                            <CustomItemCard items={items} setItems={(items) => dispatch((updateItemsInStore([...items])))}
                            />
                        </Box>
                        <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
                            <BrickLinkSearchCard />
                        </Box>
                    </>
                )}
            </Box>
            <Box style={{ marginTop: 20 }}>
                <TableComponent items={items} setItems={(items) => dispatch((updateItemsInStore([...items])))} storeMode={storeMode} disableRowAdjustmentSliders={overrideRowAdjustments} />
            </Box>
            {items.length > 0 && (
                <Totals total={total} setTotal={setTotal} items={items} storeMode={storeMode} ref={totalsRef} overrideRowAdjustments={setOverrideRowAdjustments} />
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
                setBulkCondition={(condition) => { setBulkCondition(condition) }}
                actionsDisabled={items.length === 0}
            />
            <Version />
        </div>
    );
};

export default React.memo(QuoteBuilderComponent);
import React, {FunctionComponent, useRef, useState} from "react";
import {Item} from "../../model/item/Item";
import {Box} from "@mui/material";
import TableComponent from "../Table/TableComponent/TableComponent";
import ItemSearchCard from "../Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "../Cards/CustomItemCard/CustomItemCard";
import Totals from "../Totals/Totals";
import ConfigurationCard from "../Cards/ConfigurationCard/ConfigurationCard";
import BrickLinkSearchCard from "../Cards/BrickLinkSearchCard/BrickLinkSearchCard";
import ConfirmResetCalculationsDialog from "../Dialog/ConfirmDialog/ConfirmResetCalculationsDialog";
import {formatCurrency} from "../../utils/CurrencyUtils";
import Version from "./Version";

interface TotalsRefProps {
    resetTotalsCalculations: () => void;
}

const MainComponent: FunctionComponent = () => {

    const totalsRef = useRef({} as TotalsRefProps);
    const [items, setItems] = useState<Item[]>([]);
    const [storeMode, setStoreMode] = useState<boolean>(true);
    const [showConfirmResetCalculationsDialog, setShowConfirmResetCalculationsDialog] = useState<boolean>(false);

    const resetCalculations = () => {
        items.forEach((item) => {
            item.value = item.baseValue;
            item.valueDisplay = formatCurrency(item.value).toString().substring(1);
            item.valueAdjustment = 0;
        });
        totalsRef.current.resetTotalsCalculations();
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
                        resetCalculations={() => setShowConfirmResetCalculationsDialog(true)}
                        buttonsDisabled={!items || items.length === 0}
                    />
                </Box>
            </Box>
            {items.length > 0 && (
                <Totals items={items} storeMode={storeMode} ref={totalsRef} />
            )}
            <ConfirmResetCalculationsDialog
                open={showConfirmResetCalculationsDialog}
                onCancel={() => setShowConfirmResetCalculationsDialog(false)}
                resetCalculations={() => {
                    setShowConfirmResetCalculationsDialog(false);
                    resetCalculations();
                }} />
            <Version />
        </div>
    );
};

export default MainComponent;
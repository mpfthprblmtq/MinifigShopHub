import React, {FunctionComponent, useState} from "react";
import {Item} from "../../model/item/Item";
import {Box} from "@mui/material";
import TableComponent from "../Table/Table/TableComponent";
import ItemSearchCard from "../Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "../Cards/CustomItemCard/CustomItemCard";
import Totals from "../Totals/Totals";
import ConfigurationCard from "../Cards/ConfigurationCard/ConfigurationCard";

const MainComponent: FunctionComponent = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [storeMode, setStoreMode] = useState<boolean>(true);

    const resetCalculations = () => {
        console.log('ashdfkajsh')
    };

    return (
        <div className={"App"}>
            <h1>QuoteBuilder</h1>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {storeMode && (
                        <>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <ItemSearchCard items={items} setItems={setItems} />
                            </Box>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <CustomItemCard items={items} setItems={setItems} />
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
                        resetCalculations={resetCalculations}/>
                </Box>
            </Box>
            {items.length > 0 && (
                <Totals items={items} storeMode={storeMode} />
            )}
        </div>
    );
};

export default MainComponent;
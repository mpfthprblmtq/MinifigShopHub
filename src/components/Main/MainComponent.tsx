import React, {FunctionComponent, useState} from "react";
import {Item} from "../../model/item/Item";
import {Box, FormControlLabel, Switch, Typography} from "@mui/material";
import TableComponent from "../Table/Table/TableComponent";
import ItemSearchCard from "../Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "../Cards/CustomItemCard/CustomItemCard";
import Totals from "../Totals/Totals";

const MainComponent: FunctionComponent = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [storeMode, setStoreMode] = useState<boolean>(true);

    const handleStoreModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStoreMode(event.target.checked);
    };

    return (
        <div className={"App"}>
            <h1>QuoteBuilder</h1>
            {storeMode && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <ItemSearchCard items={items} setItems={setItems} />
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <CustomItemCard items={items} setItems={setItems}/>
                    </Box>
                </Box>
            )}
            <Box style={{marginTop: 20}}>
                <TableComponent items={items} setItems={setItems} storeMode={storeMode} />
            </Box>
            {items.length > 0 && (
                <Totals items={items} storeMode={storeMode} />
            )}
            <FormControlLabel control={<Switch checked={storeMode} onChange={handleStoreModeChange} />} label={"Store Mode"} />
            <div style={{float: "left"}}>
                {items.map(item => (
                    <div key={item.id}>
                        <Typography>{item.id}: {item.no} - {item.value} / {item.valueDisplay}</Typography>
                        <Typography>{item.comment}</Typography>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainComponent;
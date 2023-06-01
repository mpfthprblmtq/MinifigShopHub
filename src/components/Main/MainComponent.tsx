import React, {FunctionComponent, useState} from "react";
import {Item} from "../../model/item/Item";
import {Box, FormControlLabel, Switch, Typography} from "@mui/material";
import TableComponent from "../Table/Table/TableComponent";
import SetSearchCard from "../SetSearchCard/SetSearchCard";

const MainComponent: FunctionComponent = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [storeMode, setStoreMode] = useState<boolean>(true);

    const handleStoreModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStoreMode(event.target.checked);
    };

    return (
        <div className={"App"}>
            <h1>QuoteBuilder</h1>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <SetSearchCard items={items} setItems={setItems} />
                </Box>
            </Box>
            <Box style={{marginTop: 20}}>
                <TableComponent items={items} setItems={setItems} storeMode={storeMode} />
            </Box>
            <FormControlLabel control={<Switch checked={storeMode} onChange={handleStoreModeChange} />} label={"Store Mode"} />
            {items.map(item => (
                <div key={item.id}>
                    <Typography>{item.id}: {item.no} - {item.value} / {item.valueDisplay}</Typography>
                    <Typography>{item.comment}</Typography>
                </div>
            ))}

        </div>
    );
};

export default MainComponent;
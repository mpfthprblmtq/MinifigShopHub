import React, {FunctionComponent, useState} from "react";
import {Box, Button, InputAdornment, TextField} from "@mui/material";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {formatCurrency, isNumeric, launderMoney} from "../../../utils/CurrencyUtils";
import {Item} from "../../../model/item/Item";
import {StyledCard} from "../Cards.styles";
import {generateId} from "../../../utils/ArrayUtils";
import {Source} from "../../../model/shared/Source";
import {Condition} from "../../../model/shared/Condition";

interface CustomItemCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}


const CustomItemCard: FunctionComponent<CustomItemCardParams> = ({items, setItems}) => {

    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<string>('');

    const addItem = () => {
        setItems([...items, {
            id: generateId(items),
            name: name,
            value: launderMoney(value),
            baseValue: launderMoney(value),
            valueDisplay: formatCurrency(value)!.toString().substring(1),
            valueAdjustment: 0,
            source: Source.CUSTOM,
            condition: Condition.USED
        }]);
        setName('');
        setValue('');
    };

    return (
        <StyledCard variant="outlined">
            <SetNameStyledTypography>Add Custom Item</SetNameStyledTypography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        sx={{backgroundColor: "white"}}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                        value={name}
                    />
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <TextField
                        label="Value"
                        value={value}
                        sx={{backgroundColor: "white"}}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        id="custom-item-field"
                        onBlur={(event) => {
                            setValue(formatCurrency(launderMoney(event.target.value))!.toString().substring(1));
                        }}
                        onChange={(event) => {
                            if (isNumeric(event.target.value)) {
                                setValue(event.target.value);
                            }
                        }}/>
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!name || !value}
                        onClick={addItem}
                        style={{width: "100px", minWidth: "100px", maxWidth: "100px", height: "50px"}}>
                        Add
                    </Button>
                </Box>
            </Box>
        </StyledCard>
    );
};

export default CustomItemCard;
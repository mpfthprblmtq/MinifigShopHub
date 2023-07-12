import React, {FunctionComponent, useState} from "react";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import {Item} from "../../../model/item/Item";
import {StyledCard} from "../Cards.styles";
import {generateId} from "../../../utils/ArrayUtils";
import {Source} from "../../../model/shared/Source";
import {Condition} from "../../../model/shared/Condition";
import {Type} from "../../../model/shared/Type";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";

interface CustomItemCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}


const CustomItemCard: FunctionComponent<CustomItemCardParams> = ({items, setItems}) => {

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<Type>(Type.OTHER);
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
            condition: Condition.USED,
            type: type
        }]);
        setName('');
        setValue('');
    };

    const handleChange = (event: any) => {
        setType(event.target.value);
    }

    return (
        <StyledCard variant="outlined">
            <SetNameStyledTypography>Add Custom Item</SetNameStyledTypography>
            <form>
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
                        <FormControl fullWidth>
                            <InputLabel id="custom-type-select-label">Type</InputLabel>
                            <Select
                                labelId="custom-type-select-label"
                                value={type}
                                label="Type"
                                onChange={handleChange}
                                sx={{backgroundColor: "white", minWidth: "100px"}}>
                                <MenuItem value={Type.OTHER}>Other</MenuItem>
                                <MenuItem value={Type.SET}>Set</MenuItem>
                                <MenuItem value={Type.MINIFIG}>Minifig</MenuItem>
                                <MenuItem value={Type.BULK}>Bulk</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <CurrencyTextInput
                            value={value}
                            label='Value'
                            onChange={(event) => setValue(event.target.value)}
                            onBlur={() => {}} />
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            color="success"
                            disabled={!name || !value}
                            onClick={addItem}
                            style={{width: "100px", minWidth: "100px", maxWidth: "100px", height: "50px"}}
                            type='submit'>
                            Add
                        </Button>
                    </Box>
                </Box>
            </form>
        </StyledCard>
    );
};

export default CustomItemCard;
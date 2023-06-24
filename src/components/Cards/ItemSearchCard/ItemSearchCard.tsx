import React, {FunctionComponent, useState} from "react";
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {green} from "@mui/material/colors";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {Item} from "../../../model/item/Item";
import {generateId} from "../../../utils/ArrayUtils";
import {Condition} from "../../../model/shared/Condition";
import {formatCurrency} from "../../../utils/CurrencyUtils";
import {useBrickLinkService} from "../../../services/useBrickLinkService";
import {Clear} from "@mui/icons-material";
import {StyledCard} from "../Cards.styles";
import {Source} from "../../../model/shared/Source";
import {AxiosError} from "axios";
import {Type} from "../../../model/shared/Type";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const [setNumber, setSetNumber] = useState<string>('');
    const [type, setType] = useState<Type>(Type.SET);
    const [loading, setLoading] = useState<boolean>(false);
    const [labelText, setLabelText] = useState<string>('Set Number');
    const [error, setError] = useState<string>('');

    const { getHydratedItem } = useBrickLinkService();

    const searchForSet = async () => {
        setLoading(true);
        setError('');
        await getHydratedItem(setNumber, type)
            .then((item: Item) => {
                setLoading(false);
                setError('');

                // generate an id and some other default goodies
                // by default, set the condition to used and use the average sold value for the value attribute
                item.id = generateId(items);
                item.condition = Condition.USED;
                item.value = item.usedSold?.avg_price ?
                    +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
                item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
                item.baseValue = item.value;
                item.valueAdjustment = 0;
                item.source = Source.BRICKLINK;
                item.type = type;

                // add the item with sales data to existing state
                setItems([...items, item]);

                // update graphics
                setLoading(false);
                setSetNumber('');

            }).catch((error: AxiosError) => {
                console.log(error);
                setLoading(false);
                if (error.response?.status === 404) {
                    setError(`Item not found: ${setNumber}`);
                } else {
                    setError("Issue with BrickLink service!");
                }
            });
    };

    const handleTypeChange = (event: any) => {
        setType(event.target.value);
        switch (event.target.value) {
            case Type.SET:
                setLabelText('Set Number');
                break;
            case Type.MINIFIG:
                setLabelText('Minifig ID');
                break;
        }
    };

    return (
        <StyledCard variant="outlined" sx={{minWidth: 400}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <form>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <TextField
                            label={labelText}
                            variant="outlined"
                            sx={{backgroundColor: "white"}}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSetNumber(event.target.value);
                            }}
                            value={setNumber}
                        />
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <FormControl fullWidth>
                            <InputLabel id="search-type-select-label">Type</InputLabel>
                            <Select
                                labelId="search-type-select-label"
                                value={type}
                                label="Type"
                                onChange={handleTypeChange}
                                sx={{backgroundColor: "white", minWidth: "100px"}}>
                                <MenuItem value={Type.SET}>Set</MenuItem>
                                <MenuItem value={Type.MINIFIG}>Minifig</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            disabled={loading || !setNumber}
                            onClick={searchForSet}
                            style={{minWidth: "100px", height: "50px"}}
                            type='submit'>
                            Search
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={loading || !setNumber}
                            onClick={() => {
                                setSetNumber('');
                                setError('');
                                setType(Type.SET);
                            }}
                            style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px"}}>
                            <Clear />
                        </Button>
                    </Box>
                </Box>
            </form>
            <Box>
                {error &&
                    <SetNameStyledTypography color={"red"}>{error}</SetNameStyledTypography>}
            </Box>
        </StyledCard>
    )
};

export default ItemSearchCard;
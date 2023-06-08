import React, {FunctionComponent, useState} from "react";
import {Box, Button, CircularProgress, TextField} from "@mui/material";
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

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const [setNumber, setSetNumber] = useState<string>('');
    const [item, setItem] = useState<Item>();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [buttonText, setButtonText] = useState('Search');

    const { getItem, getAllSalesHistory } = useBrickLinkService();

    const searchForSet = async () => {
        setLoading(true);
        await getItem(setNumber)
            .then((itemResponse: Item) => {
                setItem(itemResponse);
                setLoading(false);
                setSuccess(true);
                setButtonText('Add');
            });
    };

    const addToList = async () => {
        if (item) {
            setLoading(true);
            getAllSalesHistory(item).then(response => {
                // generate an id and some other default goodies
                // by default, set the condition to used and use the average sold value for the value attribute
                item.id = generateId(items);
                item.condition = Condition.USED;
                item.value = response.usedSold?.avg_price ?
                    +response.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
                item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
                item.baseValue = item.value;
                item.valueAdjustment = 0;
                item.source = Source.BRICKLINK;

                // add the item with sales data to existing state
                setItems([...items, { ...item, ...response }]);

                // update graphics
                setLoading(false);
                setSuccess(false);
                setButtonText('Search');
                setSetNumber('');
                setItem(undefined);
            });
        }
    };

    return (
        <StyledCard variant="outlined" sx={{maxWidth: 400}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <TextField
                        label="Set Number"
                        variant="outlined"
                        sx={{backgroundColor: "white"}}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSetNumber(event.target.value);
                        }}
                        value={setNumber}
                    />
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        sx={{
                            ...(success && item && {
                                bgcolor: green[500],
                                '&:hover': {
                                    bgcolor: green[700],
                                },
                            })
                        }}
                        disabled={loading || !setNumber}
                        onClick={buttonText === 'Search' && !item ? searchForSet : addToList}
                        style={{minWidth: "100px", height: "50px"}}>
                        {buttonText}
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
                            setSuccess(false);
                            setButtonText('Search');
                            setItem(undefined);
                        }}
                        style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px"}}>
                        <Clear />
                    </Button>
                </Box>
            </Box>
            <Box>
                {item ?
                    <SetNameStyledTypography>[{item.year_released}] {item.name}</SetNameStyledTypography> :
                    <SetNameStyledTypography>&nbsp;</SetNameStyledTypography>}
            </Box>
        </StyledCard>
    )
};

export default ItemSearchCard;
import React, {FunctionComponent, useState} from "react";
import {useBrickLinkService} from "../../services/useBrickLinkService";
import {Item} from "../../model/item/Item";
import {
    Box,
    Button,
    CircularProgress, FormControlLabel, Switch,
    TextField
} from "@mui/material";
import {green} from "@mui/material/colors";
import {SetNameStyledTypography} from "./MainComponent.styles";
import TableComponent from "../Table/Table/TableComponent";
import {Condition} from "../../model/shared/Condition";

const MainComponent: FunctionComponent = () => {

    const [setNumber, setSetNumber] = useState<string>('');
    const [item, setItem] = useState<Item>();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [buttonText, setButtonText] = useState('Search');
    const [storeMode, setStoreMode] = useState<boolean>(true);

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

    const generateId = (): number => {
        if (items.length === 0) {
            return 0;
        }
        return Math.max(...items.map(i => i.id)) + 1;
    };

    const addToList = async () => {
        if (item) {
            setLoading(true);
            getAllSalesHistory(item).then(response => {
                // generate an id and some other default goodies
                // by default, set the condition to used and use the average sold value for the value attribute
                item.id = generateId();
                item.condition = Condition.USED;
                item.value = response.usedSold?.avg_price ?
                    +response.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
                item.baseValue = item.value;
                item.valueAdjustment = 0;

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

    const handleStoreModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStoreMode(event.target.checked);
    };

    return (
        <div className={"App"}>
            <h1>QuoteBuilder</h1>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <TextField
                        label="Set Number"
                        variant="outlined"
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
            </Box>
            <Box>
                {item ? <SetNameStyledTypography style={{fontFamily: "Didact Gothic"}}>[{item.year_released}] {item.name}</SetNameStyledTypography> : <SetNameStyledTypography style={{fontFamily: "Didact Gothic"}}>&nbsp;</SetNameStyledTypography>}

            </Box>
            <Box>
                <TableComponent items={items} setItems={setItems} storeMode={storeMode} />
            </Box>
            <FormControlLabel control={<Switch checked={storeMode} onChange={handleStoreModeChange} />} label={"Store Mode"} />

        </div>
    );
};

export default MainComponent;
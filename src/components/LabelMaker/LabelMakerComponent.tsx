import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress, FormControl,
  FormControlLabel, InputLabel, MenuItem, Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import LabelContent from "./LabelContent/LabelContent";
import { useReactToPrint } from "react-to-print";
import { green } from "@mui/material/colors";
import { Item } from "../../model/item/Item";
import { AxiosError } from "axios";
import { useItemLookupService } from "../../hooks/useItemLookupService";
import MultipleItemsFoundDialog from "../QuoteBuilder/Dialog/MultipleItemsFoundDialog/MultipleItemsFoundDialog";
import { SetNameStyledTypography } from "../QuoteBuilder/QuoteBuilderComponent.styles";
import { LabelData } from "../../model/labelMaker/LabelData";
import { formatCurrency, launderMoney } from "../../utils/CurrencyUtils";
import { InfoOutlined } from "@mui/icons-material";
import CurrencyTextInput from "../_shared/CurrencyTextInput/CurrencyTextInput";
import MoreInformationDialog from "../QuoteBuilder/Dialog/MoreInformationDialog/MoreInformationDialog";
import { Status } from "../../model/labelMaker/Status";
import ValueAdjustmentSlider from "../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";

const LabelMakerComponent: FunctionComponent = () => {

  const [setNumber, setSetNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [multipleItemsDialogOpen, setMultipleItemsDialogOpen] = useState<boolean>(false);
  const [multipleItems, setMultipleItems] = useState<Item[]>([]);

  const [item, setItem] = useState<Item>();
  const [labelData, setLabelData] = useState<LabelData>({
    partsIndicator: true,
    manualIndicator: true,
    minifigsIndicator: true,
    status: Status.PRE_OWNED
  });

  const [moreInformationDialogOpen, setMoreInformationDialogOpen] = useState<boolean>(false);

  const { getHydratedItem, getItemMatches } = useItemLookupService();

  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  useEffect(() => {
    if (item) {
      item.valueDisplay = formatCurrency(item.value);
      setLabelData({...labelData, title: `${item.no} - ${item.name}`, image_url: item.image_url, value: item.value} as LabelData);
    }
    // eslint-disable-next-line
  }, [item]);

  const searchForSet = async () => {
    setLoading(true);
    setError('');

    await getItemMatches(setNumber).then(async (matches) => {
      // if there's only one match, get the hydration data and add it to the table
      if (matches.length === 1) {
        await getHydratedItem(matches[0])
          .then((item: Item) => {
            item.valueAdjustment = 90;  // TODO get value from DB
            item.value = item.baseValue * (item.valueAdjustment / 100);
            item.valueDisplay = formatCurrency(item.value);
            setItem(item);
            // update graphics
            setLoading(false);
            setSetNumber('');
          })
      } else {
        setMultipleItems(matches);
        setMultipleItemsDialogOpen(true);
        setLoading(false);
      }
    }).catch((error: AxiosError) => {
      setLoading(false);
      if (error.response?.status === 404) {
        setError(`Item not found: ${setNumber}`);
      } else {
        setError("Issue with BrickLink service!");
      }
    });
  };

  const addItem = async (item: Item) => {
    const itemToAdd = {...item};
    await getHydratedItem(itemToAdd).then(item => {
      item.valueAdjustment = 90;  // TODO get value from DB
      item.value = item.baseValue * (item.valueAdjustment / 100);
      item.valueDisplay = formatCurrency(item.value);
      setItem(item);
    });
  };

  const handleSliderChange = (event: any) => {
    if (item) {
      const calculatedValue = item.baseValue * (event.target.value / 100);
      setItem({...item, value: calculatedValue, valueAdjustment: event.target.value} as Item);
    }
  };

  const handleValueBlur = (event: any) => {
    if (item) {
      const calculatedValueAdjustment = Math.round((launderMoney(event.target.value) / item.baseValue) * 100);
      setItem({...item, valueAdjustment: calculatedValueAdjustment} as Item);
    }
  };

  return (
    <div className={"App label-maker-print-configuration"}>
      <NavBar activeTab={Tabs.LABEL_MAKER} print={handlePrint}/>
      <Version />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ m: 1, position: 'relative', width: '360px' }}>
          <form>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <TextField
                  placeholder={'Set Number'}
                  value={setNumber}
                  onChange={(event) => setSetNumber(event.target.value)} />
              </Box>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  disabled={loading || !setNumber}
                  onClick={searchForSet}
                  sx={{minWidth: "100px", height: "50px"}}
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
            </Box>
          </form>
          <Box>
            {error &&
              <SetNameStyledTypography sx={{ paddingTop: 0}} color={'error'}>{error}</SetNameStyledTypography>}
          </Box>

          {item && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Typography sx={{ fontSize: 20, fontFamily: 'Didact Gothic' }}>Set Information:</Typography>
                </Box>
                <Box sx={{ m: 1, position: 'relative', padding: 0, margin: 0 }} className={"clickable"}>
                  <Tooltip title={"More Details"}>
                    <InfoOutlined fontSize={"large"} color={"primary"} onClick={() => setMoreInformationDialogOpen(true)}/>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                value={labelData.title ?? ''}
                placeholder={'Set ID / Name'}
                disabled={!item}
                fullWidth
                onChange={(event) => setLabelData({...labelData, title: event.target.value} as LabelData)} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Typography>New Sales</Typography>
                  {item.newSold?.price_detail && item.newSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.newSold?.unit_quantity} ${+item.newSold?.unit_quantity === 1 ? 'sale' : 'sales'}`} arrow>
                      <Box sx={{color: item.newSold?.unit_quantity && item.newSold?.unit_quantity >= 5 ? '#008000' : '#BD0000' }}>
                        Min: {formatCurrency(item.newSold?.min_price)}<br/>
                        <strong>Avg: {formatCurrency(item.newSold?.avg_price)}</strong><br/>
                        Max: {formatCurrency(item.newSold?.max_price)}
                      </Box>
                    </Tooltip>
                  )}
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Typography>Used Sales</Typography>
                  {item.usedSold?.price_detail && item.usedSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.usedSold?.unit_quantity} ${+item.usedSold?.unit_quantity === 1 ? 'sale' : 'sales'}`} arrow>
                      <Box sx={{color: item.usedSold?.unit_quantity && item.usedSold?.unit_quantity >= 5 ? '#008000' : '#BD0000' }}>
                        Min: {formatCurrency(item.usedSold?.min_price)}<br/>
                        <strong>Avg: {formatCurrency(item.usedSold?.avg_price)}</strong><br/>
                        Max: {formatCurrency(item.usedSold?.max_price)}
                      </Box>
                    </Tooltip>
                  )}
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Typography>MSRP</Typography>
                  <Typography>{item.retailStatus?.availability}</Typography>
                  <Typography>{formatCurrency(item.retailStatus?.retailPrice)}</Typography>
                </Box>
              </Box>
              <ValueAdjustmentSlider value={item.valueAdjustment} handleSliderChange={handleSliderChange} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Box sx={{m: 1, position: 'relative'}}>
                  <Typography sx={{ fontSize: 20, fontFamily: 'Didact Gothic' }}>Value:</Typography>
                </Box>
                <Box sx={{m: 1, position: 'relative'}}>
                  <CurrencyTextInput
                    onChange={(event: any) => setItem({...item, value: event.target.value})}
                    onBlur={handleValueBlur}
                    value={item.valueDisplay} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{m: 1, position: 'relative'}}>
                  <FormControlLabel
                    checked={labelData.partsIndicator}
                    control={<Checkbox />}
                    label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Parts</Typography>}
                    onChange={(event: any) => setLabelData({ ...labelData, partsIndicator: event.target.checked } as LabelData)}
                  />
                </Box>
                <Box sx={{m: 1, position: 'relative'}}>
                  <FormControlLabel
                    checked={labelData.minifigsIndicator}
                    control={<Checkbox />}
                    label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Minifigs</Typography>}
                    onChange={(event: any) => setLabelData({ ...labelData, minifigsIndicator: event.target.checked } as LabelData)}
                  />
                </Box>
                <Box sx={{m: 1, position: 'relative'}}>
                  <FormControlLabel
                    checked={labelData.manualIndicator}
                    control={<Checkbox />}
                    label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Manual</Typography>}
                    onChange={(event: any) => setLabelData({ ...labelData, manualIndicator: event.target.checked } as LabelData)}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <Box sx={{m: 1, position: 'relative'}}>
                  <TextField
                    value={labelData.validatedBy}
                    placeholder={'Validated By (Initials)'}
                    onChange={(event) => {
                      if (event.target.value.length < 20) {
                        setLabelData({ ...labelData, validatedBy: event.target.value } as LabelData);
                      }
                    }} />
                </Box>
                <Box sx={{m: 1, position: 'relative' }}>
                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      fullWidth
                      value={labelData.status}
                      label="Status"
                      onChange={(event: any) => setLabelData({ ...labelData, status: event.target.value } as LabelData)}
                      sx={{backgroundColor: "white", width: '140px'}}>
                      <MenuItem value={Status.PRE_OWNED}>Pre-Owned</MenuItem>
                      <MenuItem value={Status.SEALED_BAGS}>Sealed Bags</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <LabelContent ref={componentRef} labelData={labelData}/>
        </Box>
      </Box>
      <MultipleItemsFoundDialog
        open={multipleItemsDialogOpen}
        onClose={() => setMultipleItemsDialogOpen(false)}
        items={multipleItems}
        addItem={addItem} />
      <MoreInformationDialog
        open={moreInformationDialogOpen && item !== undefined}
        onClose={() => setMoreInformationDialogOpen(false)}
        item={item} />
    </div>
  );
};

export default LabelMakerComponent;
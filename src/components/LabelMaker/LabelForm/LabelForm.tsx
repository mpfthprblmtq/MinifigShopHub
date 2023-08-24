import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel, MenuItem, Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { LabelData } from "../../../model/labelMaker/LabelData";
import { formatCurrency, launderMoney } from "../../../utils/CurrencyUtils";
import ValueAdjustmentSlider from "../../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import { Status } from "../../../model/labelMaker/Status";
import MoreInformationDialog from "../../QuoteBuilder/Dialog/MoreInformationDialog/MoreInformationDialog";
import { Item } from "../../../model/item/Item";

interface LabelFormParams {
  item: Item;
  setItem: (item: Item) => void;
  labelData: LabelData;
  setLabelData: (labelData: LabelData) => void;
}

const LabelForm: FunctionComponent<LabelFormParams> = ({item, setItem, labelData, setLabelData}) => {

  const [moreInformationDialogOpen, setMoreInformationDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      item.valueDisplay = formatCurrency(item.value);
      setLabelData({...labelData, title: `${item.no} - ${item.name}`, image_url: item.image_url, value: item.value} as LabelData);
    }
    // eslint-disable-next-line
  }, [item]);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{m: 1, position: 'relative'}}>
          <TextField
            error={!labelData.validatedBy}
            helperText={!labelData.validatedBy ? 'Required *' : ''}
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
      <MoreInformationDialog
        open={moreInformationDialogOpen}
        onClose={() => setMoreInformationDialogOpen(false)}
        item={item} />
    </>
  );
};

export default LabelForm;
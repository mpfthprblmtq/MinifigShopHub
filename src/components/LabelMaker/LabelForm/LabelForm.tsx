import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { Label } from "../../../model/labelMaker/Label";
import { formatCurrency, launderMoney, roundToNearestFive } from "../../../utils/CurrencyUtils";
import ValueAdjustmentSlider from "../../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import { Status } from "../../../model/labelMaker/Status";
import MoreInformationDialog from "../../QuoteBuilder/Dialog/MoreInformationDialog/MoreInformationDialog";
import { Item } from "../../../model/item/Item";

interface LabelFormParams {
  item: Item;
  setItem: (item: Item) => void;
  label?: Label;
  setLabel: (label: Label) => void;
}

const LabelForm: FunctionComponent<LabelFormParams> = ({item, setItem, label, setLabel}) => {

  const [moreInformationDialogOpen, setMoreInformationDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setLabel({
        ...label,
        title: item.setId && label?.title?.startsWith(item.setId) ? label.title : `${item.setId} - ${item.name}`,
        image_url: item.imageUrl,
        value: item.value,
        pieces: item.pieceCount,
        minifigs: item.minifigCount,
        minifigsIndicator: item.minifigCount !== undefined,
        partsIndicator: true,
        manualIndicator: true,
        status: Status.PRE_OWNED
      } as Label);
    }
    // eslint-disable-next-line
  }, [item]);

  const handleSliderChange = (event: any) => {
    if (item) {
      const calculatedValue = roundToNearestFive(item.baseValue * (event.target.value / 100));
      setItem({...item, value: calculatedValue, valueAdjustment: event.target.value, valueDisplay: formatCurrency(calculatedValue)} as Item);
    }
  };

  const handleValueBlur = (event: any) => {
    if (item) {
      const calculatedValueAdjustment = Math.round((launderMoney(event.target.value) / item.baseValue) * 100);
      const launderedValue = launderMoney(event.target.value);
      setItem({...item, valueAdjustment: calculatedValueAdjustment, value: launderedValue, valueDisplay: formatCurrency(launderedValue)} as Item);
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
        value={label?.title ?? ''}
        placeholder={'Set ID / Name'}
        error={!label?.title}
        label={!label?.title ? 'Required *' : ''}
        disabled={!item}
        fullWidth
        onChange={(event) => setLabel({...label, title: event.target.value} as Label)} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          {item.salesHistory?.newSales?.sales && item.salesHistory.newSales.sales.length > 0 && (
            <>
              <Typography>New Sales</Typography>
              <Tooltip title={`Based on ${item.salesHistory?.newSales?.numberOfSales} ${+item.salesHistory.newSales?.numberOfSales === 1 ? 'sale' : 'sales'}`} arrow>
                <Box sx={{color: item.salesHistory?.newSales?.numberOfSales && item.salesHistory.newSales?.numberOfSales >= 5 ? '#008000' : '#BD0000' }}>
                  Min: {formatCurrency(item.salesHistory?.newSales?.minimumPrice)}<br/>
                  <strong>Avg: {formatCurrency(item.salesHistory?.newSales?.averagePrice)}</strong><br/>
                  Max: {formatCurrency(item.salesHistory?.newSales?.maximumPrice)}
                </Box>
              </Tooltip>
            </>
          )}
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          {item.salesHistory?.usedSales?.sales && item.salesHistory.usedSales.sales.length > 0 && (
            <>
              <Typography>Used Sales</Typography>
              <Tooltip title={`Based on ${item.salesHistory?.usedSales?.numberOfSales} ${+item.salesHistory.usedSales?.numberOfSales === 1 ? 'sale' : 'sales'}`} arrow>
                <Box sx={{color: item.salesHistory?.usedSales?.numberOfSales && item.salesHistory?.usedSales?.numberOfSales >= 5 ? '#008000' : '#BD0000' }}>
                  Min: {formatCurrency(item.salesHistory?.usedSales?.minimumPrice)}<br/>
                  <strong>Avg: {formatCurrency(item.salesHistory?.usedSales?.averagePrice)}</strong><br/>
                  Max: {formatCurrency(item.salesHistory?.usedSales?.maximumPrice)}
                </Box>
              </Tooltip>
            </>
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
            value={formatCurrency(item.value) === '$0.00' ? '' : formatCurrency(item.value)}
            error={formatCurrency(item.value) === '$0.00'}
            label={formatCurrency(item.value) === '$0.00' ? 'Value cannot be $0' : ''}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box sx={{m: 1, position: 'relative'}}>
          <FormControlLabel
            checked={label?.partsIndicator ?? true}
            control={<Checkbox />}
            label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Parts</Typography>}
            onChange={(event: any) => setLabel({ ...label, partsIndicator: event.target.checked } as Label)}
          />
        </Box>
        <Box sx={{m: 1, position: 'relative'}}>
          <Tooltip title={!item.minifigCount ? 'Set has no Minifigs!' : ''} followCursor>
            <div>
              <FormControlLabel
                disabled={!item.minifigCount}
                checked={label?.minifigsIndicator ?? true}
                control={<Checkbox />}
                label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16, color: !item.minifigCount ? "gray" : "inherit" }}>Minifigs</Typography>}
                onChange={(event: any) => setLabel({ ...label, minifigsIndicator: event.target.checked } as Label)}
              />
            </div>
          </Tooltip>
        </Box>
        <Box sx={{m: 1, position: 'relative'}}>
          <FormControlLabel
            checked={label?.manualIndicator ?? true}
            control={<Checkbox />}
            label={<Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Manual</Typography>}
            onChange={(event: any) => setLabel({ ...label, manualIndicator: event.target.checked } as Label)}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{m: 1, position: 'relative'}}>
          <TextField
            error={!label?.validatedBy}
            label={!label?.validatedBy ? 'Validated By (Initials)' : ''}
            value={label?.validatedBy ?? ''}
            placeholder={'Required *'}
            onChange={(event) => {
              if (event.target.value.length < 20) {
                setLabel({ ...label, validatedBy: event.target.value } as Label);
              }
            }} />
        </Box>
        <Box sx={{m: 1, position: 'relative' }}>
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              fullWidth
              value={label?.status ?? Status.PRE_OWNED}
              label="Status"
              onChange={(event: any) => setLabel({ ...label, status: event.target.value } as Label)}
              sx={{backgroundColor: "white", width: '140px'}}>
              <MenuItem value={Status.PRE_OWNED}>Pre-Owned</MenuItem>
              <MenuItem value={Status.SEALED_BAGS}>Sealed Bags</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{m: 1, position: 'relative' }}>
        <TextField
          fullWidth
          label={'Comment'}
          value={label?.comment ?? ''}
          onChange={(event: any) => {
            if (event.target.value.length < 150) {
              setLabel({ ...label, comment: event.target.value } as Label);
            }
          }}
        />
      </Box>
      <MoreInformationDialog
        open={moreInformationDialogOpen}
        onClose={() => setMoreInformationDialogOpen(false)}
        item={item} />
    </>
  );
};

export default LabelForm;
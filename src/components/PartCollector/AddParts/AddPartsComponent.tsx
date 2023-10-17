import React, { FunctionComponent, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import ItemSearchBar from "../../_shared/ItemSearchBar/ItemSearchBar";
import { Item } from "../../../model/item/Item";
import { green } from "@mui/material/colors";
import PartsList from "./PartsList/PartsList";
import { FilterAlt, SquareRounded } from "@mui/icons-material";
import { Part } from "../../../model/partCollector/Part";
import { Color } from "../../../model/partCollector/Color";
import { useRebrickableService } from "../../../hooks/useRebrickableService";

enum SortByFields {
  All = 'All',
  Descending = 'Desc',
  Ascending = 'Asc',
  ColorItemName = 'Color, Item Name',
  ItemName = 'Item Name',
  Quantity = 'Quantity'
}

const AddPartsComponent: FunctionComponent = () => {

  const [item, setItem] = useState<Item>();
  const [parts, setParts] = useState<Part[]>([]);
  const [masterParts, setMasterParts] = useState<Part[]>([]);
  const [resultString, setResultString] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>(SortByFields.ColorItemName);
  const [order, setOrder] = useState<string>(SortByFields.Ascending);
  const [filterByColors, setFilterByColors] = useState<Color[]>([]);
  const [filterByColor, setFilterByColor] = useState<string>(SortByFields.All);

  const { getPartsList } = useRebrickableService();

  const getParts = () => {
    setLoading(true);
    if (item?.setId) {
      getPartsList(item.setId + '-1').then(parts => {
        setLoading(false);
        setMasterParts(parts);
        setParts(parts);
        buildColorFilterList(parts);
        buildResultString(parts);
      })
    }
  }

  const buildColorFilterList = (parts: Part[]) => {
    const colors: Color[] = [];
    parts.forEach(part => {
      if (!colors.some(color => color.description === part.color.description)) {
        colors.push(part.color);
      }
    });
    setFilterByColors(colors.sort((a, b) => a.description.localeCompare(b.description)));
  }

  const buildResultString = (parts: Part[]) => {
    const totalPieceCount = parts.reduce((sum, current) => sum + current.quantity, 0);
    setResultString(`Showing ${totalPieceCount.toLocaleString()} ${totalPieceCount > 1 ? ' pieces' : ' piece'}, ${parts.length.toLocaleString()} unique ${parts.length > 1 ? 'lots' : 'lot'}`);
  }

  const applyFilters = () => {
    let sortedFilteredParts: Part[];

    if (filterByColor !== SortByFields.All) {
      sortedFilteredParts = [...parts].filter(part => part.color.description === filterByColor);
    } else {
      sortedFilteredParts = [...masterParts];
    }

    switch (sortBy) {
      case SortByFields.ColorItemName: {
        sortedFilteredParts = [...sortedFilteredParts].sort((a, b) => {
          return order === SortByFields.Ascending ?
            (a.color.description + a.name).localeCompare(b.color.description + b.name)
            : (b.color.description + b.name).localeCompare(a.color.description + a.name);
        });
        break;
      }
      case SortByFields.ItemName: {
        sortedFilteredParts = [...sortedFilteredParts].sort((a, b) => {
          return order === SortByFields.Ascending ?
            (a.name).localeCompare(b.name) : (b.name).localeCompare(a.name);
        });
        break;
      }
      case SortByFields.Quantity: {
        sortedFilteredParts = [...sortedFilteredParts].sort((a, b) => {
          return order === SortByFields.Ascending ?
            (a.quantity > b.quantity ? 1 : -1) : (a.quantity < b.quantity ? 1: -1);
        });
        break;
      }
    }

    setParts([...sortedFilteredParts]);
    buildResultString(sortedFilteredParts);
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ m: 1, position: 'relative', width: '360px' }}>
          <ItemSearchBar processItem={(item: Item) => {
            setItem(item);
            setParts([]);
          }} />
        </Box>
        <Box sx={{ m: 1, position: 'relative', alignSelf: 'center' }}>
          <Button
            variant="contained"
            disabled={(loading || !item) || parts.length > 0}
            onClick={getParts}
            sx={{minWidth: "100px", height: "50px", marginLeft: '-10px'}}
          >
            Get Parts List
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box sx={{ m: 1, position: 'relative', width: '70%' }}>
          <PartsList item={item} parts={parts} setParts={setParts} set={item?.setId} />
        </Box>
        <Box sx={{ m: 1, position: 'relative', flexGrow: 2 }}>
          {parts && parts.length > 0 && (
            <Card sx={{ padding: '20px', marginTop: '80px' }}>
              <h2>Filters</h2>
              <Typography sx={{ marginBottom: '20px' }}>{resultString}</Typography>
              <FormControl sx={{ minWidth: '200px' }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label={'Sort By'}
                  onChange={(event) => setSortBy(event.target.value as string)}>
                  <MenuItem value={SortByFields.ColorItemName}>{SortByFields.ColorItemName}</MenuItem>
                  <MenuItem value={SortByFields.ItemName}>{SortByFields.ItemName}</MenuItem>
                  <MenuItem value={SortByFields.Quantity}>{SortByFields.Quantity}</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: '100px', marginLeft: '10px' }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={order}
                  label={'Order'}
                  onChange={(event) => setOrder(event.target.value as string)}>
                  <MenuItem value={SortByFields.Ascending}>{SortByFields.Ascending}</MenuItem>
                  <MenuItem value={SortByFields.Descending}>{SortByFields.Descending}</MenuItem>
                </Select>
              </FormControl><br />
              <FormControl sx={{ minWidth: '200px', marginTop: '10px' }}>
                <InputLabel>Color</InputLabel>
                <Select
                  sx={{ maxHeight: '56px' }}
                  value={filterByColor}
                  label={'Color'}
                  onChange={(event) => setFilterByColor(event.target.value as string)}>
                  <MenuItem value={SortByFields.All}>{SortByFields.All}</MenuItem>
                  {filterByColors.map((color, index) => (
                    <MenuItem key={index} value={color.description}>
                      <Box sx={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                        <Box sx={{ m: 1, position: 'relative', margin: 0, marginTop: '5px' }}>
                          <SquareRounded sx={{ color: `#${color.rgb}` }} />
                        </Box>
                        <Box sx={{ m: 1, position: 'relative', margin: 0, marginTop: '3px' }}>
                          {color.description}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl><br />
              <Button
                sx={{ float: 'right' }}
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={applyFilters}>
                Apply
              </Button>
            </Card>
          )}
        </Box>
      </Box>
    </>
  );
}

export default AddPartsComponent;
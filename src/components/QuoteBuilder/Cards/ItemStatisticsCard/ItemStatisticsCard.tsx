import React, { FunctionComponent, useEffect, useState } from "react";
import { Item } from "../../../../model/item/Item";
import { Box, Card, Typography } from "@mui/material";
import { Condition } from "../../../../model/_shared/Condition";

interface ItemStatisticsCardParams {
  items: Item[];
}

const ItemStatisticsCard: FunctionComponent<ItemStatisticsCardParams> = ({ items }) => {

  const [newItems, setNewItems] = useState<number>();
  const [usedItems, setUsedItems] = useState<number>();

  useEffect(() => {
    setNewItems(items.filter(item => item.condition === Condition.NEW).length);
    setUsedItems(items.filter(item => item.condition === Condition.USED).length);
  }, [items]);

  return (
    <Card sx={{position: 'absolute', backgroundColor: '#F5F5F5', marginTop: '20px', marginLeft: '20px', minWidth: '300px', minHeight: '80px', padding: '10px', display: 'flex', alignItems: 'center'}}>
      <Box sx={{ position: 'relative', m: 1}}>
        <Typography sx={{fontSize: 18}}>{`${items.length} Items`}</Typography>
        <Typography sx={{fontSize: 15}}>{`${newItems} New, ${usedItems} Used`}</Typography>
      </Box>
    </Card>
  );
}

export default ItemStatisticsCard;
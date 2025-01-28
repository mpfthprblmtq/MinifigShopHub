import React, { FC, useState } from "react";
import { Item } from "../../../../model/item/Item";
import { Box, Divider, ListItem, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Launch } from "@mui/icons-material";
import { useBackendService } from "../../../../hooks/useBackendService";

interface ItemRowParams {
  item: Item;
  addItem: (item: Item) => void;
}

const ItemRow: FC<ItemRowParams> = ({item, addItem}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { getItem } = useBackendService();

  const hydrateItem = async (item: Item) => {
    setLoading(true);
    if (item && item.bricklinkId) {
      await getItem(item.bricklinkId).then(hydratedItem => {
        addItem(hydratedItem.items[0]);
        setLoading(false);
      })
    }
  }

  return (
    <>
      <ListItem>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <img src={item.imageUrl} width={100} alt={'bricklink-img'} />
          </Box>
          <Box sx={{ m: 1, position: 'relative', flexGrow: 4 }}>
            <Typography>{item.setId}</Typography>
            <Typography>{item.name}</Typography>
          </Box>
          <Box sx={{ m: 1, position: 'relative' }}>
            <LoadingButton
              sx={{height: '50px', fontSize: '18px'}}
              color='success'
              variant='contained'
              loading={loading}
              loadingPosition='start'
              startIcon={<Launch sx={{transform: 'rotate(270deg)'}}/>}
              onClick={() => hydrateItem(item)}
            >Add</LoadingButton>
          </Box>
        </Box>
      </ListItem>
      <Divider />
    </>
  )
};

export default React.memo(ItemRow);
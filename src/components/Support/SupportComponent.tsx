import React, { FC, memo, useState } from "react";
import NavBar from "../_shared/NavBar/NavBar";
import { Tabs } from "../_shared/NavBar/Tabs";
import { Box, Button, Typography } from "@mui/material";
import { useCacheService } from "../../hooks/cache/useCacheService";
// import { useBrickEconomyService } from "../../_hooks/useBrickEconomyService";
// import ItemSearchBar from "../_shared/ItemSearchBar/ItemSearchBar";
// import { Item } from "../../model/item/Item";
// import { RetailStatus } from "../../model/retailStatus/RetailStatus";
// import { useBricksetService } from "../../_hooks/useBricksetService";
// import { useBrickLinkService } from "../../_hooks/useBrickLinkService";
// import { useItemLookupService } from "../../_hooks/useItemLookupService";
// import { AllSalesHistory } from "../../model/salesHistory/AllSalesHistory";
// import { useCacheService } from "../../hooks/cache/useCacheService";
// import { useBackendService } from "../../hooks/useBackendService";
// import { RebrickableResponse } from "../../model/rebrickable/RebrickableResponse";

const SupportComponent: FC = () => {

  // const { getBricklinkData, getAllSalesHistory } = useBrickLinkService();
  // const { getPieceAndMinifigCount, getRetailStatus } = useBrickEconomyService();
  // const { getPartsList } = useBackendService();
  // const { getBricksetData } = useBricksetService();
  // const { determineType } = useItemLookupService();
  const { clearCache, getCacheItemCount } = useCacheService();
  //
  // const [set, setSet] = useState<string>('');
  // const [apiResult, setApiResult] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false);
  const [cacheItems, setCacheItems] = useState<number>(getCacheItemCount());
  //
  // const testBrickLink = async () => {
  //   setLoading(true);
  //   const brickLinkData: Item = await getBricklinkData(set, determineType(set));
  //   const allSalesHistory: AllSalesHistory = await getAllSalesHistory(brickLinkData);
  //   setLoading(false);
  //
  //   setApiResult(JSON.stringify({brickLinkData: brickLinkData, salesData: allSalesHistory}, null, 2));
  // };
  //
  // const testBrickSet = async () => {
  //   setLoading(true);
  //   const item: Item | undefined = await getBricksetData({setId: set} as Item);
  //   setLoading(false);
  //
  //   setApiResult(JSON.stringify(item, null, 2));
  // };
  //
  // const testRebrickable = async () => {
  //   setLoading(true);
  //   const partsResponse: RebrickableResponse = await getPartsList(set);
  //   setLoading(false);
  //
  //   setApiResult(JSON.stringify(partsResponse.parts, null, 2));
  // };
  //
  // const testBrickEconomy = async () => {
  //   setLoading(true);
  //   const pieceAndMinifigCount: number[] = await getPieceAndMinifigCount(set);
  //   const retailStatus: RetailStatus = await getRetailStatus(set);
  //   setLoading(false);
  //
  //   setApiResult(JSON.stringify({
  //     pieceCount: pieceAndMinifigCount[0],
  //     minifigCount: pieceAndMinifigCount[1],
  //     retailStatus: retailStatus
  //   }, null, 2));
  // };
  //
  // const processItem = (item: Item) => {
  //   setApiResult(JSON.stringify(item, null, 2));
  // }

  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.SUPPORT} />
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
        <Button variant='contained' color='error' onClick={() => {
          clearCache();
          setCacheItems(0);
        }}>Clear Cache</Button>
        <Typography sx={{fontSize: '20px', marginLeft: '10px'}}>
          {`${cacheItems} ${cacheItems === 1 ? 'item' : 'items'} in application cache!`}
        </Typography>
      </Box>
      {/*<Box sx={{ width: '550px' }}>*/}
      {/*  <ItemSearchBar processItem={processItem} onChange={(event) => setSet(event.target.value)} />*/}
      {/*</Box>*/}
      {/*<Box>*/}
      {/*  <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickLink} variant={'contained'}>BrickLink</Button>*/}
      {/*  <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickSet} variant={'contained'}>BrickSet</Button>*/}
      {/*  <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testRebrickable} variant={'contained'}>Rebrickable</Button>*/}
      {/*  <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickEconomy} variant={'contained'}>BrickEconomy</Button>*/}
      {/*{loading ? <LinearProgress sx={{width: '550px', marginTop: '10px'}} /> : <Box sx={{height: '14px'}} />}*/}
      {/*<pre>{apiResult}</pre>*/}
    </div>
  );
};

export default memo(SupportComponent);
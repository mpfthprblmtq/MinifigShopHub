import React, { FC, memo, useState } from "react";
import NavBar from "../_shared/NavBar/NavBar";
import { Tabs } from "../_shared/NavBar/Tabs";
import { Box, Button, LinearProgress } from "@mui/material";
import { useBrickEconomyService } from "../../hooks/useBrickEconomyService";
import ItemSearchBar from "../_shared/ItemSearchBar/ItemSearchBar";
import { Item } from "../../model/item/Item";
import { RetailStatus } from "../../model/retailStatus/RetailStatus";
import { useRebrickableService } from "../../hooks/useRebrickableService";
import { Part } from "../../model/partCollector/Part";
import { useBricksetService } from "../../hooks/useBricksetService";
import { useBrickLinkService } from "../../hooks/useBrickLinkService";
import { useItemLookupService } from "../../hooks/useItemLookupService";
import { AllSalesHistory } from "../../model/salesHistory/AllSalesHistory";

const SupportComponent: FC = () => {

  const [set, setSet] = useState<string>('');
  const [apiResult, setApiResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { getBricklinkData, getAllSalesHistory } = useBrickLinkService();
  const { getPieceAndMinifigCount, getRetailStatus } = useBrickEconomyService();
  const { getPartsList } = useRebrickableService();
  const { getBricksetData } = useBricksetService();
  const { determineType } = useItemLookupService();

  const testBrickLink = async () => {
    setLoading(true);
    const brickLinkData: Item = await getBricklinkData(set, determineType(set));
    const allSalesHistory: AllSalesHistory = await getAllSalesHistory(brickLinkData);
    setLoading(false);

    setApiResult(JSON.stringify({brickLinkData: brickLinkData, salesData: allSalesHistory}, null, 2));
  };

  const testBrickSet = async () => {
    setLoading(true);
    const item: Item = await getBricksetData({setId: set} as Item);
    setLoading(false);

    setApiResult(JSON.stringify(item, null, 2));
  };

  const testRebrickable = async () => {
    setLoading(true);
    const parts: Part[] = await getPartsList(set);
    setLoading(false);

    setApiResult(JSON.stringify(parts, null, 2));
  };

  const testBrickEconomy = async () => {
    setLoading(true);
    const pieceAndMinifigCount: number[] = await getPieceAndMinifigCount(set);
    const retailStatus: RetailStatus = await getRetailStatus(set);
    setLoading(false);

    setApiResult(JSON.stringify({
      pieceCount: pieceAndMinifigCount[0],
      minifigCount: pieceAndMinifigCount[1],
      retailStatus: retailStatus
    }, null, 2));
  };

  const processItem = (item: Item) => {
    setApiResult(JSON.stringify(item, null, 2));
  }

  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.SUPPORT} />
      <Box sx={{ width: '550px' }}>
        <ItemSearchBar processItem={processItem} onChange={(event) => setSet(event.target.value)} />
      </Box>
      <Box>
        <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickLink} variant={'contained'}>BrickLink</Button>
        <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickSet} variant={'contained'}>BrickSet</Button>
        <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testRebrickable} variant={'contained'}>Rebrickable</Button>
        <Button sx={{margin: '5px', width: '130px'}} disabled={!set} onClick={testBrickEconomy} variant={'contained'}>BrickEconomy</Button>
      </Box>
      {loading ? <LinearProgress sx={{width: '550px', marginTop: '10px'}} /> : <Box sx={{height: '14px'}} />}
      <pre>{apiResult}</pre>
    </div>
  );
};

export default memo(SupportComponent);
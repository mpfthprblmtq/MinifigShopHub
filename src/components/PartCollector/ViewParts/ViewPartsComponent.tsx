import React, { FunctionComponent, useEffect, useState } from "react";
import { usePartsService } from "../../../hooks/dynamo/usePartsService";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import PartTile from "./PartTile";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { StyledCard } from "../../QuoteBuilder/Cards/Cards.styles";

const ViewPartsComponent: FunctionComponent = () => {

  const [parts, setParts] = useState<PartDisplay[]>([]);
  const [masterParts, setMasterParts] = useState<PartDisplay[]>([]);
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [setNumber, setSetNumber] = useState<string>('');
  const [statisticString, setStatisticString] = useState<string>('');

  const { getAllParts } = usePartsService();

  useEffect(() => {
    getAllParts().then(parts => {
      setParts(parts);
      setMasterParts(parts);
      buildStatisticString(parts);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let filteredParts: PartDisplay[] = masterParts.filter(part =>
      part.part.name.toLowerCase().includes(searchDescription.toLowerCase()));
    let setMatchesFound: boolean = false;
    filteredParts.forEach(part => {
      if (part.set === setNumber) {
        setMatchesFound = true;
      }
    });
    filteredParts = setMatchesFound ? filteredParts.filter(part => part.set === setNumber) : filteredParts;
    buildStatisticString(filteredParts);
    setParts(filteredParts);
    // eslint-disable-next-line
  }, [searchDescription, setNumber]);

  const buildStatisticString = (filteredParts: PartDisplay[]) => {
    if (filteredParts) {
      const entries: number = filteredParts.length;
      const totalPieces: number = filteredParts.reduce((sum, part) => sum + part.quantity, 0);
      const differentSets: number = new Set(parts.map(part => part.set)).size;
      setStatisticString(`${entries} ${entries > 1 ? 'entries' : 'entry'} found, ${totalPieces} total ${totalPieces > 1 ? 'pieces' : 'piece'}, ${differentSets} ${differentSets > 1 ? 'different sets' : 'set'}`);
    } else {
      setStatisticString('No entries found!')
    }
  }

  return (
    <>
      <StyledCard sx={{ minHeight: '80px'}}>
        <Stack direction={'row'}>
          <Typography variant={'h4'} sx={{ margin: '15px'}}>Filters:</Typography>
          <TextField
            label={'Search Description'}
            variant="outlined"
            sx={{ width: '400px', margin: '10px', backgroundColor: 'white' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchDescription(event.target.value);
            }}
            value={searchDescription}
          />
          <TextField
            label={'Set Number'}
            variant="outlined"
            sx={{ width: '200px', margin: '10px', backgroundColor: 'white' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSetNumber(event.target.value);
            }}
            value={setNumber}
          />
        </Stack>
      </StyledCard>
      <Typography variant={'h6'} sx={{ marginLeft: '30px', marginTop: '10px' }}>
        {statisticString}
      </Typography>
      <hr style={{ marginTop: '20px', marginBottom: '20px' }}/>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {parts.map((part, index) => (
          <PartTile partDisplay={part} key={index} />
        ))}
      </Box>
    </>
  );
}

export default ViewPartsComponent;
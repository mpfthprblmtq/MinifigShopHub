import React, { FunctionComponent, useEffect, useState } from "react";
import { usePartsService } from "../../../hooks/dynamo/usePartsService";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import PartTile from "./PartTile";
import { Box, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { StyledCard } from "../../QuoteBuilder/Cards/Cards.styles";
import { useSnackbar } from "../../../app/contexts/SnackbarProvider";
import {useAuth0} from "@auth0/auth0-react";

const ViewPartsComponent: FunctionComponent = () => {

  const [parts, setParts] = useState<PartDisplay[]>([]);
  const [masterParts, setMasterParts] = useState<PartDisplay[]>([]);
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [setNumber, setSetNumber] = useState<string>('');
  const [statisticString, setStatisticString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const { getAllParts, deletePartFromDatabase } = usePartsService();
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth0();

  useEffect(() => {
    getAllParts(user?.org_id).then(parts => {
      setParts(parts);
      setMasterParts(parts);
      buildStatisticString(parts);
      setLoading(false);
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
    if (filteredParts.length > 0) {
      const entries: number = filteredParts.length;
      const totalPieces: number = filteredParts.reduce((sum, part) => sum + part.quantity, 0);
      const differentSets: number = new Set(filteredParts.map(part => part.set)).size;
      setStatisticString(`${entries} ${entries > 1 ? 'entries' : 'entry'} found, ${totalPieces} total ${totalPieces > 1 ? 'pieces' : 'piece'}, ${differentSets} ${differentSets > 1 ? 'different sets' : 'set'}`);
    } else {
      setStatisticString('No entries found!')
    }
  }

  const deletePart = async (part: PartDisplay) => {
    await deletePartFromDatabase(part.id)
      .then(() => {
        showSnackbar('Part removed successfully', 'success');
        const updatedParts: PartDisplay[] = [...parts].filter(removedPart => removedPart.id !== part.id);
        setParts(updatedParts);
        buildStatisticString(updatedParts);
      }).catch(error => {
        showSnackbar(`Couldn't delete part!\n${error.statusCode} - ${error.message}`, 'error');
      });
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
      {loading ? (
        <LinearProgress sx={{marginTop: '20px', marginBottom: '20px'}} />
      ) : (
        <Typography variant={'h6'} sx={{ marginLeft: '30px', marginTop: '10px' }}>
          {statisticString}
        </Typography>
      )}
      <hr style={{ marginTop: '10px', marginBottom: '20px' }}/>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {parts.map((part, index) => (
          <PartTile partDisplay={part} key={index} deletePart={deletePart} />
        ))}
      </Box>
    </>
  );
}

export default ViewPartsComponent;
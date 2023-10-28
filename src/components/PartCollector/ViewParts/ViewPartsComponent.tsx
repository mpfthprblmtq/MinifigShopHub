import React, { FunctionComponent, useEffect, useState } from "react";
import { usePartsService } from "../../../hooks/dynamo/usePartsService";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";
import PartTile from "./PartTile";
import { Alert, Box, Button, LinearProgress, Portal, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { StyledCard } from "../../QuoteBuilder/Cards/Cards.styles";
import { SnackbarState } from "../../_shared/Snackbar/SnackbarState";

const ViewPartsComponent: FunctionComponent = () => {

  const [parts, setParts] = useState<PartDisplay[]>([]);
  const [masterParts, setMasterParts] = useState<PartDisplay[]>([]);
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [setNumber, setSetNumber] = useState<string>('');
  const [statisticString, setStatisticString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});
  const [lastDeletedPart, setLastDeletedPart] = useState<PartDisplay>();

  const { getAllParts, addPartToDatabase, deletePartFromDatabase } = usePartsService();

  useEffect(() => {
    getAllParts().then(parts => {
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
    await deletePartFromDatabase(part.key)
      .then(() => {
        setSnackbarState({open: true, severity: 'success', message: 'Part removed successfully!'});
        setLastDeletedPart(part);
        const updatedParts: PartDisplay[] = [...parts].filter(removedPart => removedPart.key !== part.key);
        setParts(updatedParts);
        buildStatisticString(updatedParts);
      }).catch(error => {
        setSnackbarState({open: true, severity: 'error', message: `Couldn't delete part!\n${error.statusCode} - ${error.message}`});
        setLastDeletedPart(undefined);
      });
  }

  const undoDelete = async () => {
    if (lastDeletedPart) {
      await addPartToDatabase(lastDeletedPart.part, lastDeletedPart.quantity, lastDeletedPart.comment, lastDeletedPart.set ?? '', lastDeletedPart.key)
        .then(() => {
          setLastDeletedPart(undefined);
          setSnackbarState({open: true, severity: 'success', message: `${lastDeletedPart.part.name} added successfully!`});
          setParts([...parts, lastDeletedPart]);
          buildStatisticString([...parts, lastDeletedPart]);
        }).catch((error) => {
          setSnackbarState({open: true, severity: 'error', message: `Couldn't undo delete!\n${error.statusCode} - ${error.message}`});
        });
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
      <Portal>
        <Snackbar
          sx={{marginTop: '50px'}}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({open: false})}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
            {snackbarState.message}
            {lastDeletedPart && (
              <Button color="primary" onClick={undoDelete} sx={{height: '20px'}}>
                <strong>UNDO</strong>
              </Button>
            )}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}

export default ViewPartsComponent;
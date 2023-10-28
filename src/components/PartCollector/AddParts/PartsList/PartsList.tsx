import React, { FunctionComponent, useState } from "react";
import { Part } from "../../../../model/partCollector/Part";
import {
  Alert, Box, Button, Portal,
  Snackbar,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { StyledTableCell } from "../../../QuoteBuilder/Table/TableComponent/TableComponent.styles";
import { Item } from "../../../../model/item/Item";
import PartRow from "./PartRow";
import { usePartsService } from "../../../../hooks/dynamo/usePartsService";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";

interface PartsListParams {
  item?: Item;
  parts: Part[];
  set?: string;
  setParts: (parts: Part[]) => void;
}

const PartsList: FunctionComponent<PartsListParams> = ({item, parts, set, setParts}) => {

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});
  const [lastAddedPartKey, setLastAddedPartKey] = useState<string>('');
  const { addPartToDatabase, deletePartFromDatabase } = usePartsService();

  const addPart = async (part: Part, quantityToAdd: number, comment: string) => {
    await addPartToDatabase(part, quantityToAdd, comment, set ?? '')
      .then((key) => {
        setLastAddedPartKey(key);
        setSnackbarState({open: true, severity: 'success', message: `${part.name} added successfully!`});
        setParts([...parts!].map(toUpdate => toUpdate.id === part.id ? { ...part} : toUpdate));
      }).catch((error) => {
        setSnackbarState({open: true, severity: 'error', message: `Couldn't add part!\n${error.statusCode} - ${error.message}`});
      });
  };

  const undoAdd = async () => {
    await deletePartFromDatabase(lastAddedPartKey)
      .then(() => {
        setSnackbarState({open: true, severity: 'success', message: 'Part removed successfully!'});
        setLastAddedPartKey('');
      }).catch(error => {
        setSnackbarState({open: true, severity: 'error', message: `Couldn't delete part!\n${error.statusCode} - ${error.message}`});
      });
  }

  return (
    <>
      {item && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
          <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
            <img src={item.imageUrl} style={{ maxHeight: '100px', maxWidth: '200px', height: 'auto', width: 'auto' }} alt={'item-img'} />
          </Box>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 20 }}>
              {item.setId} - {item.name}
            </Typography>
            <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
              {item.yearReleased} ({item.retailStatus?.availability})
            </Typography>
            <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
              {`${item.pieceCount?.toLocaleString()} Pieces${item.minifigCount ? `, ${item.minifigCount} Minifigs`: ''}`}
            </Typography>
          </Box>
        </Box>
      )}
      <TableContainer sx={{ maxHeight: '80vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {parts && parts.length > 0 && (
              <TableRow>
                <StyledTableCell width={75} />
                <StyledTableCell width={120}>
                  Part ID
                </StyledTableCell>
                <StyledTableCell width={300}>
                  Description
                </StyledTableCell>
                <StyledTableCell width={50}>
                  Quantity
                </StyledTableCell>
                <StyledTableCell/>
              </TableRow>
            )}
          </TableHead>
          {parts && parts.length > 0 && (
            <TableBody>
              {parts.map((part, index) => (
                <PartRow key={index} part={part} addPart={addPart} />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Portal>
        <Snackbar
          sx={{marginTop: '50px'}}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({open: false})}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
            {snackbarState.message}
            {lastAddedPartKey && (
              <Button color="primary" onClick={undoAdd} sx={{height: '20px'}}>
                <strong>UNDO</strong>
              </Button>
            )}
          </Alert>
        </Snackbar>
      </Portal>
    </>

  )
};

export default PartsList;
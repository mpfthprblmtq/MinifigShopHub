import React, { FunctionComponent, useState } from "react";
import { Part } from "../../../../model/partCollector/Part";
import {
  Alert, Button, Portal,
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
    <TableContainer sx={{ maxHeight: '80vh' }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          {item && (
            <TableRow>
              <StyledTableCell width={75}>
                <img src={item.imageUrl} style={{ maxHeight: '100px', maxWidth: '200px', height: 'auto', width: 'auto' }} alt={'item-img'} />
              </StyledTableCell>
              <StyledTableCell colSpan={3}>
                <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 20 }}>
                  {item.setId} - {item.name}
                </Typography>
                <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
                  {item.yearReleased} ({item.retailStatus?.availability})
                </Typography>
                <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
                  {`${item.pieceCount?.toLocaleString()} Pieces${item.minifigCount ? `, ${item.minifigCount} Minifigs`: ''}`}
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2} />
            </TableRow>
          )}
          {parts && parts.length > 0 && (
            <TableRow>
              <StyledTableCell width={75} sx={{ top: '89px' }} />
              <StyledTableCell width={120} sx={{ top: '89px', textAlign: 'center' }} >
                Part ID
              </StyledTableCell>
              <StyledTableCell width={300} sx={{ top: '89px' }} >
                Description
              </StyledTableCell>
              <StyledTableCell width={50} sx={{ top: '89px' }}>
                Quantity
              </StyledTableCell>
              <StyledTableCell sx={{ top: '89px' }} />
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
    </TableContainer>
  )
};

export default PartsList;
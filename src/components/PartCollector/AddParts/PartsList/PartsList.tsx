import React, { FunctionComponent, useEffect, useState } from "react";
import { Part } from "../../../../model/partCollector/Part";
import {
  Box,
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
import { useSnackbar } from "../../../../app/contexts/SnackbarProvider";

interface PartsListParams {
  item?: Item;
  parts: Part[];
  setParts: (parts: Part[]) => void;
}

const PartsList: FunctionComponent<PartsListParams> = ({item, parts, setParts}) => {

  const [spareParts, setSpareParts] = useState<Part[]>([]);
  const { addPartToDatabase } = usePartsService();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setSpareParts(parts.filter(part => part.isSpare));
  }, [parts]);

  const addPart = async (part: Part, quantityToAdd: number, comment: string) => {
    await addPartToDatabase(part, quantityToAdd, comment, item?.setId ?? '')
      .then(() => {
        showSnackbar(`${part.name} added successfully!`, 'success');
        setParts([...parts!].map(toUpdate => toUpdate.id === part.id ? { ...part} : toUpdate));
      }).catch((error) => {
        showSnackbar(`Couldn't add part!\n${error.statusCode} - ${error.message}`, 'error');
      });
  };

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
            {item.retailStatus?.availability && (
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
                {item.yearReleased} ({item.retailStatus?.availability})
              </Typography>
            )}
            {item.pieceCount && (
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>
                {`${item.pieceCount?.toLocaleString()} Pieces${item.minifigCount ? `, ${item.minifigCount} Minifigs`: ''}`}
              </Typography>
            )}
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
              {parts.filter(part => !part.isSpare).map((part, index) => (
                <PartRow key={index} part={part} addPart={addPart} />
              ))}
            </TableBody>
          )}
        </Table>
        {spareParts && spareParts.length > 0 && (
          <>
            <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 30, margin: '30px' }}>Spare Parts</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell width={75} />
                  <StyledTableCell width={120} sx={{ textAlign: 'center' }}>
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
              </TableHead>
              <TableBody>
                {spareParts.map((part, index) => (
                  <PartRow key={index} part={part} addPart={addPart} />
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </TableContainer>
    </>

  )
};

export default PartsList;
import {TableCell} from "@mui/material";
import styled from "styled-components";

export const FixedWidthColumnHeading = styled(TableCell)`
  max-width: ${props => props.width}px;
  width: ${props => props.width}px;
  font-size: 18px !important;
  font-family: 'Didact Gothic', sans-serif !important;
  font-weight: bold !important;
  padding: 5px !important;
`;

export const StyledTableCell = styled(TableCell)`
  font-family: 'Arial', sans-serif !important;
  color: ${props => props.color} !important;
  padding: 5px !important;
`;
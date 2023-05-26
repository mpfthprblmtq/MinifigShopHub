import {TableCell} from "@mui/material";
import styled from "styled-components";

export const FixedWidthTableCell = styled(TableCell)`
  max-width: ${props => props.width}px;
  width: ${props => props.width}px;
`;
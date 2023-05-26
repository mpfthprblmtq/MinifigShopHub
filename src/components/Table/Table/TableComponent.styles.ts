import {TableCell} from "@mui/material";
import styled from "styled-components";

export const FixedWidthColumnHeading = styled(TableCell)`
  max-width: ${props => props.width}px;
  width: ${props => props.width}px;
  font-size: 18px !important;
`;
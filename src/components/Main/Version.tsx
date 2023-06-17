import {FunctionComponent} from "react";
import styled from "styled-components";
import {Typography} from "@mui/material";
import packageJson from '../../../package.json';

const StyledTypography = styled(Typography)`
  position: fixed;
  bottom: 5px;
  right: 5px;
`;

const Version: FunctionComponent = () => {
    return (
        <StyledTypography>© Pat Ripley / Version: {packageJson.version}</StyledTypography>
    );
}

export default Version;
import React, {FunctionComponent, useState} from "react";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {Box, Button, TextField} from "@mui/material";
import {StyledCard} from "../Cards.styles";
import {Search} from "@mui/icons-material";

const BrickLinkSearchCard:FunctionComponent = () => {

    const [query, setQuery] = useState<string>('');

    const search = () => {
        // length of at least 2 characters is a validation set on BrickLink's site
        if (query && query.length >= 2) {
            const url = `https://bricklink.com/v2/search.page?q=${encodeURIComponent(query)}#T=A`;
            window.open(url, '_blank');
        }
    };

    return (
        <StyledCard variant="outlined">
            <SetNameStyledTypography>Search BrickLink</SetNameStyledTypography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <TextField
                        label="Search Query"
                        variant="outlined"
                        sx={{backgroundColor: "white", minWidth: 300}}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setQuery(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                search();
                            }
                        }}
                        value={query}
                    />
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={search}
                        style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", margin: "5px"}}
                        type='submit'>
                        <Search />
                    </Button>
                </Box>
            </Box>
        </StyledCard>
    )
};

export default BrickLinkSearchCard;
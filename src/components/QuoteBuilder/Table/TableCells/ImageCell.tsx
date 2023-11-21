import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
import {Box} from "@mui/material";
import {Source} from "../../../../model/_shared/Source";
import {Type} from "../../../../model/_shared/Type";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface ImageCellParams {
    item: Item;
    compressedView: boolean;
    onClick: (item: Item) => void;
}

const ImageCell: FunctionComponent<ImageCellParams> = ({item, compressedView, onClick}) => {
    return (
        <StyledTableCell className={"clickable"}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {item.thumbnailUrl && item.imageUrl && (
                    <img alt="bricklink-set-img" src={item.thumbnailUrl} onClick={() => onClick(item)} height={compressedView ? 35 : 'auto'} />
                )}
                {item.sources?.includes(Source.CUSTOM) && item.type !== Type.OTHER && (
                    <img src={`assets/images/${item.type}.svg`} alt={item.type} width={55}/>
                )}
            </Box>
        </StyledTableCell>
    );
};

export default React.memo(ImageCell);
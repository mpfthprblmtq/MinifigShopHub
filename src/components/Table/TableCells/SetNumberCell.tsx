import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import {Type} from "../../../model/_shared/Type";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface SetNumberParams {
    item: Item;
}

const SetNumberCell: FunctionComponent<SetNumberParams> = ({item}) => {
    return (
        <StyledTableCell>
            <a
                href={`https://www.bricklink.com/v2/catalog/catalogitem.page?${
                    item.type === Type.SET ? 'S' : 'M'
                }=${item.no}#T=P`}
                target="_blank" rel="noreferrer">{item.no}
            </a>
        </StyledTableCell>
    );
};

export default SetNumberCell;
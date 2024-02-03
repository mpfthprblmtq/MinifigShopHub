import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
import CurrencyTextInput from "../../../_shared/CurrencyTextInput/CurrencyTextInput";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import { Typography } from "@mui/material";

interface ValueCellParams {
    item: Item;
    handleValueBlur: (event: any, id: number) => void;
    // handleValueChange: (event: any, id: number) => void;
    storeMode: boolean;
    editable: boolean;
}

const ValueCell: FunctionComponent<ValueCellParams> = ({item, handleValueBlur, storeMode, editable}) => {
    return (
      <StyledTableCell>
          <div style={{width: "150px", minWidth: "150px", maxWidth: "150px"}}>
              <CurrencyTextInput
                label={storeMode && item.retailStatus?.retailPrice ? 'MSRP: ' + formatCurrency(item.retailStatus.retailPrice) : ''}
                value={item.valueDisplay}
                onChange={() => {}}
                onBlur={(event) => handleValueBlur(event, item.id)}
                color={storeMode && item.value > 100 ? '#BD0000' : 'black'}
                readonly={editable}
                endAdornment={
                  editable ? (
                    <></>
                  ) : (
                    <Typography sx={{fontSize: '14px', color: 'gray'}}>
                      {`${item.valueAdjustment}%`}
                    </Typography>
                  )
                }
              />
          </div>
      </StyledTableCell>
    );
};

export default ValueCell;
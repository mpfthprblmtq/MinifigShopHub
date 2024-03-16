import React, { FunctionComponent, useEffect, useState } from "react";
import {Item} from "../../../../model/item/Item";
import CurrencyTextInput from "../../../_shared/CurrencyTextInput/CurrencyTextInput";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import { Typography } from "@mui/material";

interface ValueCellParams {
    item: Item;
    handleValueBlur: (event: any, id: number) => void;
    storeMode: boolean;
}

const ValueCell: FunctionComponent<ValueCellParams> = ({item, handleValueBlur, storeMode}) => {

  const [valueDisplay, setValueDisplay] = useState(formatCurrency(item.value));
  const [adjustment, setAdjustment] = useState<number>(item.valueAdjustment);
  useEffect(() => {
    setValueDisplay(formatCurrency(Math.round(item.value)));
    setAdjustment(item.valueAdjustment);
  }, [item]);

    return (
      <StyledTableCell>
          <div style={{width: "150px", minWidth: "150px", maxWidth: "150px"}}>
              <CurrencyTextInput
                label={storeMode && item.retailStatus?.retailPrice ? 'MSRP: ' + formatCurrency(item.retailStatus.retailPrice) : ''}
                value={valueDisplay}
                onChange={(event) => setValueDisplay(event.target.value)}
                onBlur={(event) => {
                  setValueDisplay(formatCurrency(event.target.value.substring(2)));
                  handleValueBlur(event, item.id);
                }}
                color={storeMode && item.value > 100 ? '#BD0000' : 'black'}
                error={item.value === 0}
                endAdornment={adjustment !== 0 ? (
                    // <Box onClick={() => alert('TODO: Add ability to change percentage here')}>
                    <Typography sx={{fontSize: '14px', color: 'gray'}}>
                      {`${adjustment}%`}
                    </Typography>
                    // </Box>
                  ) : (<></>)
                }
              />
          </div>
      </StyledTableCell>
    );
};

export default ValueCell;
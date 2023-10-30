import React, { FunctionComponent, useState } from "react";
import { Part } from "../../../../model/partCollector/Part";
import { StyledTableCell } from "../../../QuoteBuilder/Table/TableComponent/TableComponent.styles";
import { Box, TableRow, TextField, Typography } from "@mui/material";
import { Add, SquareRounded } from "@mui/icons-material";
import InformationDialog from "../../../_shared/InformationDialog/InformationDialog";
import { LoadingButton } from "@mui/lab";

interface PartRowParams {
  part: Part;
  addPart: (part: Part, quantityToAdd: number, comment: string) => Promise<void>;
}

const PartRow: FunctionComponent<PartRowParams> = ({part, addPart}) => {

  const [focusedImage, setFocusedImage] = useState<string | undefined>();
  const [quantityToAdd, setQuantityToAdd] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = () => {
    setLoading(true);
    addPart(part, quantityToAdd, comment).then(() => setLoading(false));
  }

  return (
    <>
      <TableRow hover>
        <StyledTableCell width={75} className={'clickable'}>
          <img src={part.imageUrl} width={75} alt={'part-img'} onClick={() => setFocusedImage(part.imageUrl)}/>
        </StyledTableCell>
        <StyledTableCell width={120} sx={{textAlign: 'center'}}>
          <a target={'_blank'} rel={'noreferrer'}
             href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${part.bricklinkId}&C=${part.color.id}`}>
            {part.bricklinkId}
          </a>
        </StyledTableCell>
        <StyledTableCell>
          {part.name}
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <Box sx={{ m: 1, position: 'relative', margin: 0, marginTop: '5px' }}>
              <SquareRounded sx={{ color: `#${part.color.rgb}` }} />
            </Box>
            <Box sx={{ m: 1, position: 'relative', margin: 0, marginTop: '3px' }}>
              {part.color.description}
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Typography sx={{ textAlign: 'center', fontSize: 20 }}>{part.quantity}</Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <TextField
                sx={{ width: '50px' }}
                label={'Quantity'}
                value={quantityToAdd}
                onChange={(event) => setQuantityToAdd(+event.target.value)}
                type={'number'}
                inputProps={{ min: 0 }}
                InputLabelProps={{
                  shrink: true
                }}
                variant={'standard'}
              />
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
              <TextField
                label={'Comment'}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
              <LoadingButton
                sx={{ height: '48px' }}
                color="success"
                onClick={handleAdd}
                loading={loading}
                loadingPosition="start"
                startIcon={<Add />}
                variant="contained"
                disabled={quantityToAdd === 0}>
                Add
              </LoadingButton>
            </Box>
          </Box>
        </StyledTableCell>
      </TableRow>
      <InformationDialog
        open={!!focusedImage}
        onClose={() => setFocusedImage(undefined)}
        title={''}
        content={<img src={focusedImage} alt="part-img" />}
      />
    </>
  );
};

export default PartRow;
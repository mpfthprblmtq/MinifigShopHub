import React, { FC, memo, useState } from "react";
import { Part } from "./Part";
import { Box, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { colorMap } from "./ColorMap";
import { subtract } from "lodash";
import { Add, Remove } from "@mui/icons-material";
import InformationDialog from "../_shared/InformationDialog/InformationDialog";
import { useBrickLinkService } from "../../hooks/useBrickLinkService";
import { Type } from "../../model/_shared/Type";
import { useDispatch } from "react-redux";
import { updatePartCount } from "../../redux/slices/partFinderSlice";

interface PartRowParams {
  part: Part;
}

const PartRow: FC<PartRowParams> = ({part}) => {

  const [moreInformationDialogOpen, setMoreInformationDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { getBricklinkData } = useBrickLinkService();

  const dispatch = useDispatch();

  const openMoreInformationDialog = async () => {
    setLoading(true);
    await getBricklinkData(part.id, Type.PART).then(result => {
      setName(result.name);
      setLoading(false);
    });
    setMoreInformationDialogOpen(true);
  }

  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <Box sx={{position: 'relative', m: 1}}>
          <Tooltip title={colorMap.get(part.colorId)}>
            {loading ? <CircularProgress size={50} /> : <img src={part.imageUrl} height={50} alt={'part-img'} onClick={openMoreInformationDialog}/>}
          </Tooltip>
        </Box>
        <Box sx={{position: 'relative', m: 1, textAlign: 'center'}}>
          <Typography><a href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${part.id}&idColor=${part.colorId}`}
                         target={'_blank'} rel="noreferrer">{part.id}</a></Typography>
          <Typography>{colorMap.get(part.colorId)}</Typography>
        </Box>
        <Box sx={{position: 'relative', m: 1}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography sx={{fontSize: '20px', marginRight: '10px'}}>{subtract(part.quantityNeeded, part.quantityHave)}</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => dispatch(updatePartCount({...part, quantityHave: part.quantityHave + 1} as Part))}
              style={{width: "40px", minWidth: "40px", maxWidth: "40px", height: "40px", margin: "4px"}}
            >
              <Remove />
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => dispatch(updatePartCount({...part, quantityHave: part.quantityHave - 1} as Part))}
              style={{width: "40px", minWidth: "40px", maxWidth: "40px", height: "40px", margin: "4px"}}
            >
              <Add />
            </Button>
          </Box>
        </Box>
      </Box>
      <hr style={{margin: '2px'}} />
      <InformationDialog
        open={moreInformationDialogOpen}
        onClose={() => setMoreInformationDialogOpen(false)}
        title={'More Info'}
        content={
        <Box>
          <img src={part.imageUrl} width={'100%'} alt={'large-img'} />
          <table>
            <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{name}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td>
              <td>{colorMap.get(part.colorId)}</td>
            </tr>
            <tr>
              <td><strong>Set:</strong></td>
              <td>{part.set}</td>
            </tr>
            </tbody>
          </table>
        </Box>
        } />
    </div>
  );
};

export default memo(PartRow);
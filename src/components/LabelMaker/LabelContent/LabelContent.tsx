import { forwardRef } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { LabelData } from "../../../model/labelMaker/LabelData";

interface LabelContentParams {
  labelData?: LabelData;
}

const LabelContent = forwardRef(({labelData}: LabelContentParams, ref) => {
  return (
    <Box sx={{border: 1, float: 'right', padding: '10px', position: 'relative'}} width={780} height={480} ref={ref}>
      {labelData && (
        <>
          <Box sx={{ display: 'flex', position: 'relative', justifyContent: 'space-between' }}>
            <Box sx={{m: 1, position: 'relative'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 24, marginBottom: '5px' }}>{`${labelData.item.no} - ${labelData.item.name}`}</Typography>
              <Box
                component="img"
                sx={{ height: 260, maxWidth: 500 }}
                alt="SET"
                src={labelData.item.image_url}
              />
            </Box>
            <Box sx={{m: 1, position: 'relative', width: '30%', minWidth: '30%'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 24, marginBottom: '15px', textAlign: 'right' }}>$5.00</Typography>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 18, textAlign: 'right' }}>Pre-Owned - 100% Complete</Typography>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 18, textAlign: 'right' }}>1,234 Pcs, 2 Minifigs</Typography>
              <Box
                component="img"
                sx={{
                  height: 120,
                  marginBottom: '-50px',
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }}
                alt="UPC"
                src='/assets/images/upc-codes/UPC_005.png'
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center'}}>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={true} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Parts</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={true} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Minifigs</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={true} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Manual</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>Validated By: <strong>MA</strong></Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', position: 'absolute', bottom: 0, justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center'}}>
              <Box sx={{m: 1, position: 'relative'}}>
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 18 }}>
                  {`${labelData.item.no} - ${labelData.item.name}`}
                </Typography>
              </Box>
              <Box sx={{m: 1, position: 'relative'}}>
                <img src={labelData.item.image_url} height={50} alt={'set'}/>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px'}}>
              <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 24 }}>
                $5.00
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
});

export default LabelContent;
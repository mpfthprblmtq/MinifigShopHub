import { forwardRef, useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { LabelData } from "../../../model/labelMaker/LabelData";
import { formatCurrency } from "../../../utils/CurrencyUtils";

interface LabelContentParams {
  labelData?: LabelData;
}

const LabelContent = forwardRef(({labelData}: LabelContentParams, ref) => {

  const [barCodeLabel, setBarCodeLabel] = useState<string>('/assets/images/upc-codes/UPC_VAR.png');

  useEffect(() => {
    console.log(labelData?.value);
    if (labelData && labelData.value && labelData.value % 5 === 0 && labelData.value <= 100) {
      setBarCodeLabel(`/assets/images/upc-codes/UPC_${labelData.value.toString().replace('.00', '').padStart(3, '0')}.png`);
    } else {
      setBarCodeLabel('/assets/images/upc-codes/UPC_VAR.png');
    }
    // eslint-disable-next-line
  }, [labelData?.value]);

  return (
    <Box sx={{border: 1, float: 'right', padding: '10px', position: 'relative'}} width={780} height={480} ref={ref}>
      {labelData?.title && (
        <>
          <Box sx={{ display: 'flex', position: 'relative', justifyContent: 'space-between' }}>
            <Box sx={{m: 1, position: 'relative'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 24, marginBottom: '5px' }}>{labelData.title}</Typography>
              <Box
                component="img"
                sx={{ height: 260, maxWidth: 500 }}
                alt="SET"
                src={labelData.image_url}
              />
            </Box>
            <Box sx={{m: 1, position: 'relative', width: '35%', minWidth: '30%'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 24, marginBottom: '15px', textAlign: 'right' }}>
                {formatCurrency(labelData.value)}
              </Typography>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 18, textAlign: 'right' }}>
                {`${labelData.status} - 100% Complete`}
              </Typography>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 18, textAlign: 'right' }}>
                1,234 Pcs, 2 Minifigs
              </Typography>
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
                src={barCodeLabel}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center'}}>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={labelData.partsIndicator} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Parts</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={labelData.minifigsIndicator} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Minifigs</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <FormControlLabel checked={labelData.manualIndicator} control={<Checkbox />} label={
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 16 }}>Manual</Typography>} />
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <Typography sx={{ fontFamily: 'Didact Gothic', fontSize: 16 }}>Validated By: <strong>{labelData.validatedBy}</strong></Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', position: 'absolute', bottom: 0, justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center'}}>
              <Box sx={{m: 1, position: 'relative'}}>
                <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 18 }}>
                  {labelData.title}
                </Typography>
              </Box>
              <Box sx={{m: 1, position: 'relative'}}>
                <img src={labelData.image_url} height={50} alt={'set'}/>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px'}}>
              <Typography sx={{ fontFamily: "Didact Gothic", fontSize: 24 }}>
                {formatCurrency(labelData.value)}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
});

export default LabelContent;